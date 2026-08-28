import type { GameAction, GameErrorCode } from '@durak-master/schemas';

import { computeRatingGain } from '@durak-master/schemas';
import { Injectable, Logger } from '@nestjs/common';

import type { FinishedPlayer, RoomEvent, RoomMember } from '../../game';
import type { Socket } from '../realtime.types';

import { GameHistoryService, RoomsService } from '../../game';
import { AchievementsService } from '../../social';
import { BroadcastService } from './broadcast.service';
import { SessionsService } from './sessions.service';
import { SocketRegistryService } from './socket-registry.service';

const PENDING_RESULTS_LIMIT = 500;

@Injectable()
export class GameFlowService {
  private readonly logger = new Logger(GameFlowService.name);

  private readonly pendingResults = new Map<
    string,
    { loserUserId: string | null; isDraw: boolean; creditsDelta: number; ratingDelta: number }
  >();

  constructor(
    private readonly rooms: RoomsService,
    private readonly sessions: SessionsService,
    private readonly achievements: AchievementsService,
    private readonly history: GameHistoryService,
    private readonly registry: SocketRegistryService,
    private readonly broadcast: BroadcastService
  ) {}

  applyAction(
    socket: Socket,
    userId: string,
    payload: { action: GameAction; expectedVersion: number }
  ): void {
    const room = this.rooms.getRoomOfUser(userId);

    if (!room) {
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

  handleRoomEvent(roomId: string, event: RoomEvent): void {
    switch (event.type) {
      case 'state-changed':
        this.broadcast.gameState(roomId);
        this.broadcast.table(roomId);
        this.broadcast.lobby();
        break;

      case 'finished':
        void this.finish(roomId, event).catch((error: unknown) => {
          this.logger.error(`Failed to settle game in room ${roomId}`, error);
        });
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

  private async finish(
    roomId: string,
    event: { loserUserId: string | null; isDraw: boolean; members: RoomMember[] }
  ): Promise<void> {
    const room = this.rooms.getRoom(roomId);

    if (!room) {
      return;
    }

    const { loserUserId, isDraw, members } = event;
    const { bet } = room.settings;

    const winners = members.filter(
      (member) => member.profile.userId !== loserUserId && !member.isBot
    );

    const humans = members.filter((member) => !member.isBot);
    const prize = isDraw || winners.length === 0 ? 0 : bet + Math.floor(bet / winners.length);

    const played: FinishedPlayer[] = [];

    for (const member of humans) {
      const { userId } = member.profile;
      const isLoser = userId === loserUserId;
      const isWinner = !isLoser && !isDraw;
      const creditsDelta = isDraw ? 0 : isLoser ? -bet : prize - bet;
      const ratingDelta = isWinner ? computeRatingGain(prize, member.profile.rating) : 0;

      await this.sessions.applyGameResult({
        userId,
        creditsDelta,
        ratingDelta,
        isWinner,
        isDraw
      });

      played.push({ userId, seat: member.seat, creditsDelta, ratingDelta, isLoser });

      await this.notifyPlayer(false, userId, room.settings.game, {
        loserUserId,
        isDraw,
        isWinner,
        creditsDelta,
        ratingDelta
      });
    }

    void this.history.recordFinishedGame({
      tableId: room.id,
      settings: room.settings,
      players: played,
      loserUserId,
      isDraw
    });

    this.broadcast.gameState(roomId);
    this.broadcast.table(roomId);
    this.broadcast.lobby();
  }

  private async notifyPlayer(
    isBot: boolean,
    userId: string,
    game: string,
    outcome: {
      loserUserId: string | null;
      isDraw: boolean;
      isWinner: boolean;
      creditsDelta: number;
      ratingDelta: number;
    }
  ): Promise<void> {
    const { loserUserId, isDraw, isWinner, creditsDelta, ratingDelta } = outcome;

    const unlocked = isBot
      ? []
      : await this.achievements.recordGame(userId, {
          isWin: isWinner,
          isFlawless: false,
          endedOnTrumps: false,
          game: game as Parameters<AchievementsService['recordGame']>[1]['game']
        });

    const socket = this.registry.get(userId);
    const result = { loserUserId, isDraw, creditsDelta, ratingDelta };

    if (!socket) {
      if (!isBot) {
        if (this.pendingResults.size >= PENDING_RESULTS_LIMIT) {
          const oldest = this.pendingResults.keys().next().value;

          if (oldest !== undefined) {
            this.pendingResults.delete(oldest);
          }
        }

        this.pendingResults.set(userId, result);
      }

      return;
    }

    this.registry.send(socket, { type: 'game:finished', payload: result });

    if (isBot) {
      return;
    }

    if (unlocked.length > 0) {
      this.registry.send(socket, { type: 'achievements:unlocked', payload: { ids: unlocked } });
    }

    this.registry.send(socket, {
      type: 'profile:updated',
      payload: { profile: await this.sessions.reload(userId) }
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
