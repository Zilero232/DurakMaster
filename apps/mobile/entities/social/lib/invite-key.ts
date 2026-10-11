import type { InviteTarget } from '../model/store';

export const inviteKey = ({ userId, tableId }: InviteTarget): string => `${tableId}:${userId}`;
