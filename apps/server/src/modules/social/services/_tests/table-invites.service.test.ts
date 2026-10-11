import { INVITE_RESEND_MS, INVITE_TTL_MS } from '@durak-master/schemas';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TableInvitesService } from '../table-invites.service';

const invite = { fromId: 'host', toId: 'guest', tableId: 'table-1' };

describe('table invites', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('holds back a second invite to the same friend for a while', () => {
    const invites = new TableInvitesService();

    invites.record(invite);

    expect(invites.isCoolingDown(invite)).toBe(true);

    vi.advanceTimersByTime(INVITE_RESEND_MS);

    expect(invites.isCoolingDown(invite)).toBe(false);
  });

  it('lets the same friend be invited to another table at once', () => {
    const invites = new TableInvitesService();

    invites.record(invite);

    expect(invites.isCoolingDown({ ...invite, tableId: 'table-2' })).toBe(false);
  });

  it('lets the invited friend in until the invite expires', () => {
    const invites = new TableInvitesService();

    invites.record(invite);

    expect(invites.isInvited({ userId: 'guest', tableId: 'table-1' })).toBe(true);
    expect(invites.isInvited({ userId: 'stranger', tableId: 'table-1' })).toBe(false);

    vi.advanceTimersByTime(INVITE_TTL_MS);

    expect(invites.isInvited({ userId: 'guest', tableId: 'table-1' })).toBe(false);
  });
});
