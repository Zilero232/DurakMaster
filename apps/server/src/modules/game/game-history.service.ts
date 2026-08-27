import type { GameCoreState, TableSettings } from '@durak-master/schemas';

import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../lib/prisma/prisma.service';

export type FinishedPlayer = {
  userId: string;
  seat: number;
  creditsDelta: number;
  ratingDelta: number;
  isLoser: boolean;
};

export type RecordGameInput = {
  tableId: string;
  settings: TableSettings;
  players: FinishedPlayer[];
  loserUserId: string | null;
  isDraw: boolean;
};

@Injectable()
export class GameHistoryService {
  private readonly logger = new Logger(GameHistoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async ensureTable(
    tableId: string,
    settings: TableSettings,
    passwordHash: string | null
  ): Promise<void> {
    try {
      await this.prisma.gameTable.upsert({
        where: { id: tableId },
        create: {
          id: tableId,
          game: settings.game,
          settings,
          maxPlayers: settings.maxPlayers,
          bet: BigInt(settings.bet),
          isPrivate: settings.isPrivate,
          passwordHash
        },
        update: { status: 'PLAYING' }
      });
    } catch (error) {
      this.logger.error(`Failed to record table ${tableId}`, error);
    }
  }

  async recordFinishedGame(input: RecordGameInput): Promise<void> {
    const { tableId, settings, players, loserUserId, isDraw } = input;

    try {
      await this.prisma.game.create({
        data: {
          tableId,
          game: settings.game,
          settings,
          bet: BigInt(settings.bet),
          loserUserId,
          isDraw,
          finishedAt: new Date(),
          players: {
            create: players.map((player) => ({
              userId: player.userId,
              seat: player.seat,
              creditsDelta: BigInt(player.creditsDelta),
              ratingDelta: player.ratingDelta,
              isLoser: player.isLoser
            }))
          }
        }
      });
    } catch (error) {
      this.logger.error(`Failed to record a finished game at table ${tableId}`, error);
    }
  }

  async saveSnapshot(tableId: string, state: GameCoreState): Promise<void> {
    try {
      await this.prisma.game.updateMany({
        where: { tableId, finishedAt: null },
        data: { snapshot: state as object, version: state.version }
      });
    } catch (error) {
      this.logger.error(`Failed to snapshot table ${tableId}`, error);
    }
  }

  async closeTable(tableId: string): Promise<void> {
    try {
      await this.prisma.gameTable.updateMany({
        where: { id: tableId },
        data: { status: 'FINISHED', nodeId: null }
      });
    } catch (error) {
      this.logger.error(`Failed to close table ${tableId}`, error);
    }
  }
}
