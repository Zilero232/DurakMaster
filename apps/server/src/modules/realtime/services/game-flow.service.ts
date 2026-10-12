import type { FinishReason, GameAction, GameErrorCode } from '@durak-master/schemas';

import { computeRatingGain } from '@durak-master/schemas';
import { Injectable, Logger } from '@nestjs/common';

import type { FinishedPlayer, FinishFacts, RoomEvent, RoomMember } from '../../game';
import type { Socket } from '../realtime.types';

import { GameHistoryService, RoomsService } from '../../game';
import { ProfilesService } from '../../profile';
import { AchievementsService } from '../../social';
import { splitPot } from '../lib/split-pot';
import { BroadcastService } from './broadcast.service';
import { SessionsService } from './sessions.service';
import { SocketRegistryService } from './socket-registry.service';

const PENDING_RESULTS_LIMIT = 500;

@Injectable()
export class GameFlowService {
  private readonly logger = new Logger(GameFlowService.name);

  private readonly pendingResults = new Map<
    string,
    {
      loserUserId: string | null;
      isDraw: boolean;
      creditsDelta: number;
      ratingDelta: number;
      reason: FinishReason;
    }
  >();

  constructor(
    private readonly rooms: RoomsService,
    private readonly sessions: SessionsService,
    private readonly achievements: AchievementsService,
    private readonly history: GameHistoryService,
    private readonly registry: SocketRegistryService,
    private readonly broadcast: BroadcastService,
    private readonly profiles: ProfilesService
  ) {
    this.rooms.onEvent((roomId, event) => this.handleRoomEvent(roomId, event));

    this.profiles.onIdentityChanged((userId, identity) => {
      this.refreshSeatedProfile(userId, identity);
    });
  }

  applyAction(
    socket: Socket,
    userId: string,
    payload: { action: GameAction; expectedVersion: number }
  ): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
      this.registry.send(socket, {
        type: 'game:rejected',
        payload: { code: 'NOT_IN_GAME' }
      });

      return;
    }

    const error = room.applyAction(userId, payload.action, payload.expectedVersion);

    if (error) {
      this.registry.send(socket, {
        type: 'game:rejected',
        payload: { code: error as GameErrorCode }
      });
    }
  }

  private async handleRoomEvent(roomId: string, event: RoomEvent): Promise<void> {
    switch (event.type) {
      case 'state-changed':
        this.broadcast.gameState(roomId);
        this.broadcast.table(roomId);
        this.broadcast.lobby();
        break;

      case 'finished':
        await this.finish(roomId, event).catch((error: unknown) => {
          this.logger.error(`Failed to settle game in room ${roomId}`, error);
        });
        break;

      case 'stake-released':
        await this.profiles.releaseStake(event.userId, event.bet).catch((error: unknown) => {
          this.logger.error(`Failed to release the stake for ${event.userId}`, error);
        });
        break;

      case 'idle-removed':
        this.sendBackToLobby(roomId, event.userIds);
        break;

      case 'phrase':
        this.broadcast.toRoom(roomId, {
          type: 'table:phrase',
          payload: { phrase: event.phrase }
        });
        break;

      case 'emoji':
        this.broadcast.toRoom(roomId, {
          type: 'table:emoji',
          payload: { userId: event.userId, emoji: event.emoji }
        });
        break;

      default:
        break;
    }
  }

  refreshSeatedProfile(userId: string, profile: { avatarUrl: string | null; name: string }): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room?.updateProfile(userId, { name: profile.name, avatarUrl: profile.avatarUrl })) {
      return;
    }

    this.broadcast.table(room.id);
    this.broadcast.lobby();
  }

  private sendBackToLobby(roomId: string, userIds: string[]): void {
    for (const userId of userIds) {
      this.registry.sendTo(userId, { type: 'table:left' });
    }

    this.broadcast.table(roomId);
    this.broadcast.lobby();
  }

  private async finish(
    roomId: string,
    event: {
      loserUserId: string | null;
      isDraw: boolean;
      members: RoomMember[];
      outPlaces: Record<string, number>;
      facts: FinishFacts;
      reason: FinishReason;
      removedUserId?: string;
    }
  ): Promise<void> {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    const { loserUserId, isDraw, members, outPlaces, facts, reason, removedUserId } = event;
    const { bet } = room.settings;

    const winners = members.filter(
      (member) => member.profile.userId !== loserUserId && !member.isBot
    );

    const humans = members.filter((member) => !member.isBot);

    const shares = isDraw
      ? []
      : splitPot(
          bet,
          winners.map((member) => ({
            userId: member.profile.userId,
            outPlace: outPlaces[member.profile.userId] ?? null
          }))
        );

    const shareOf = new Map(shares.map((share) => [share.userId, share.amount]));

    const results = humans.map((member) => {
      const { userId } = member.profile;
      const isLoser = userId === loserUserId;
      const isWinner = !isLoser && !isDraw;
      const share = shareOf.get(userId) ?? 0;

      return {
        userId,
        seat: member.seat,
        isLoser,
        isWinner,
        creditsDelta: isDraw ? 0 : isLoser ? -bet : share,
        payout: isDraw ? bet : isLoser ? 0 : bet + share,
        ratingDelta: isWinner ? computeRatingGain(share, member.profile.rating) : 0
      };
    });

    await this.sessions.applyGameResults(
      results.map(({ userId, payout, ratingDelta, isWinner }) => ({
        userId,
        payout,
        ratingDelta,
        isWinner,
        isDraw
      }))
    );

    for (const { userId, isWinner, creditsDelta, ratingDelta } of results) {
      await this.notifyPlayer(userId, {
        isFlawless: !facts.tookUserIds.includes(userId),
        tableSize: members.length,
        loserUserId,
        isDraw,
        isWinner,
        creditsDelta,
        ratingDelta,
        reason
      });
    }

    const played: FinishedPlayer[] = results.map(
      ({ userId, seat, creditsDelta, ratingDelta, isLoser }) => ({
        userId,
        seat,
        creditsDelta,
        ratingDelta,
        isLoser
      })
    );

    void this.history
      .recordFinishedGame({
        tableId: room.id,
        settings: room.settings,
        players: played,
        loserUserId,
        isDraw
      })
      .catch((error: unknown) => {
        this.logger.error(`Failed to record the finished game in room ${roomId}`, error);
      });

    if (removedUserId) {
      this.registry.sendTo(removedUserId, { type: 'table:left' });
    }

    this.broadcast.gameState(roomId);
    this.broadcast.table(roomId);
    this.broadcast.lobby();
  }

  private async notifyPlayer(
    userId: string,
    outcome: {
      isFlawless: boolean;
      tableSize: number;
      loserUserId: string | null;
      isDraw: boolean;
      isWinner: boolean;
      creditsDelta: number;
      ratingDelta: number;
      reason: FinishReason;
    }
  ): Promise<void> {
    const { loserUserId, isDraw, isWinner, creditsDelta, ratingDelta, reason } = outcome;

    const unlocked = await this.achievements.recordGame(userId, {
      isWin: isWinner,
      isFlawless: outcome.isFlawless,
      tableSize: outcome.tableSize
    });

    const socket = this.registry.get(userId);
    const result = { loserUserId, isDraw, creditsDelta, ratingDelta, reason };

    if (!socket) {
      if (this.pendingResults.size >= PENDING_RESULTS_LIMIT) {
        const oldest = this.pendingResults.keys().next().value;

        if (oldest !== undefined) {
          this.pendingResults.delete(oldest);
        }
      }

      this.pendingResults.set(userId, result);

      return;
    }

    this.registry.send(socket, { type: 'game:finished', payload: result });

    if (unlocked.length > 0) {
      this.registry.send(socket, { type: 'achievements:unlocked', payload: { ids: unlocked } });
    }

    this.registry.send(socket, {
      type: 'profile:updated',
      payload: { profile: await this.sessions.load(userId) }
    });
  }

  deliverPendingResult(userId: string): void {
    const result = this.pendingResults.get(userId);

    if (!result) {
      return;
    }

    const socket = this.registry.get(userId);

    if (!socket) {
      return;
    }

    this.pendingResults.delete(userId);
    this.registry.send(socket, { type: 'game:finished', payload: result });
  }
}
