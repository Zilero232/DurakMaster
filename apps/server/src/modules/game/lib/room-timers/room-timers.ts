import { randomInt } from 'node:crypto';

import type { RoomTimersHandlers } from './room-timers.types';

import { BOT_DELAY_SPREAD_MS, BOT_MIN_DELAY_MS, BOT_SILENT_DELAY_MS } from '../../config';

export class RoomTimers {
  private turnTimer: NodeJS.Timeout | null = null;
  private botTimer: NodeJS.Timeout | null = null;
  private readyTimer: NodeJS.Timeout | null = null;

  constructor(private readonly handlers: RoomTimersHandlers) {}

  scheduleTurn(timeoutMs: number): void {
    this.clearTurn();

    this.turnTimer = setTimeout(() => this.handlers.onTurnTimeout(), timeoutMs);
  }

  scheduleBot(isVisible = true, scale = 1): void {
    this.clearBot();

    const delay = isVisible
      ? BOT_MIN_DELAY_MS + randomInt(BOT_DELAY_SPREAD_MS)
      : BOT_SILENT_DELAY_MS;

    this.botTimer = setTimeout(() => this.handlers.onBotTurn(), Math.round(delay * scale));
  }

  scheduleReady(timeoutMs: number): void {
    this.clearReady();

    this.readyTimer = setTimeout(() => this.handlers.onReadyTimeout(), timeoutMs);
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

  clearReady(): void {
    if (this.readyTimer) {
      clearTimeout(this.readyTimer);
      this.readyTimer = null;
    }
  }

  clearAll(): void {
    this.clearTurn();
    this.clearBot();
    this.clearReady();
  }
}
