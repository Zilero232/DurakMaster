import { randomInt } from 'node:crypto';

import type { RoomTimersHandlers } from './room-timers.types';

import { BOT_DELAY_SPREAD_MS, BOT_MIN_DELAY_MS } from '../../config';

export class RoomTimers {
  private turnTimer: NodeJS.Timeout | null = null;
  private botTimer: NodeJS.Timeout | null = null;

  constructor(private readonly handlers: RoomTimersHandlers) {}

  scheduleTurn(timeoutMs: number): void {
    this.clearTurn();

    this.turnTimer = setTimeout(() => this.handlers.onTurnTimeout(), timeoutMs);
  }

  scheduleBot(): void {
    this.clearBot();

    this.botTimer = setTimeout(
      () => this.handlers.onBotTurn(),
      BOT_MIN_DELAY_MS + randomInt(BOT_DELAY_SPREAD_MS)
    );
  }

  clearTurn(): void {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }
  }

  clearBot(): void {
    if (this.botTimer) {
      clearTimeout(this.botTimer);
      this.botTimer = null;
    }
  }

  clearAll(): void {
    this.clearTurn();
    this.clearBot();
  }
}
