import { INVITE_RESEND_MS, INVITE_TTL_MS } from '@durak-master/schemas';
import { Injectable } from '@nestjs/common';

export type TableInviteInput = {
  fromId: string;
  toId: string;
  tableId: string;
};

export type TableInviteCheck = {
  userId: string;
  tableId: string;
};

@Injectable()
export class TableInvitesService {
  private readonly lastSentAt = new Map<string, number>();
  private readonly passExpiresAt = new Map<string, number>();

  isCoolingDown({ fromId, toId, tableId }: TableInviteInput): boolean {
    const sentAt = this.lastSentAt.get(`${fromId}:${toId}:${tableId}`);

    return sentAt !== undefined && Date.now() - sentAt < INVITE_RESEND_MS;
  }

  record({ fromId, toId, tableId }: TableInviteInput): number {
    const now = Date.now();
    const expiresAt = now + INVITE_TTL_MS;

    this.forgetExpired(now);
    this.lastSentAt.set(`${fromId}:${toId}:${tableId}`, now);
    this.passExpiresAt.set(`${toId}:${tableId}`, expiresAt);

    return expiresAt;
  }

  isInvited({ userId, tableId }: TableInviteCheck): boolean {
    const expiresAt = this.passExpiresAt.get(`${userId}:${tableId}`);

    return expiresAt !== undefined && Date.now() < expiresAt;
  }

  private forgetExpired(now: number): void {
    for (const [key, sentAt] of this.lastSentAt) {
      if (now - sentAt >= INVITE_RESEND_MS) {
        this.lastSentAt.delete(key);
      }
    }

    for (const [key, expiresAt] of this.passExpiresAt) {
      if (now >= expiresAt) {
        this.passExpiresAt.delete(key);
      }
    }
  }
}
