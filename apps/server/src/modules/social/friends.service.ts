import type { Friend, FriendList, PublicProfile } from '@durak-master/schemas';

import { MAX_FRIENDS } from '@durak-master/schemas';
import { Injectable } from '@nestjs/common';

import type { FriendshipStatus } from '../../../generated/prisma/enums';

import { PrismaService } from '../../lib/prisma/prisma.service';
import { ProfilesService } from '../profile/profiles.service';

export type FriendError =
  | 'ALREADY_FRIENDS'
  | 'CANNOT_FRIEND_SELF'
  | 'FRIEND_LIMIT_REACHED'
  | 'REQUEST_NOT_FOUND'
  | 'USER_NOT_FOUND';

export type FriendResult = { error: FriendError } | { ok: true };

@Injectable()
export class FriendsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profiles: ProfilesService
  ) {}

  async list(userId: string): Promise<FriendList> {
    const rows = await this.prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
        status: { in: ['PENDING', 'ACCEPTED'] }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const friends: Friend[] = [];
    const incoming: Friend[] = [];
    const outgoing: Friend[] = [];

    const profiles = await this.profiles.getPublicProfiles(
      rows.map((row) => (row.requesterId === userId ? row.addresseeId : row.requesterId))
    );

    for (const row of rows) {
      const isOutgoing = row.requesterId === userId;
      const otherId = isOutgoing ? row.addresseeId : row.requesterId;

      const profile = profiles.get(otherId);

      if (!profile) {
        continue;
      }

      const friend: Friend = {
        profile,
        status: row.status.toLowerCase() as Friend['status'],
        isOutgoing,
        tableId: null,
        since: row.acceptedAt?.getTime() ?? null
      };

      if (row.status === 'ACCEPTED') {
        friends.push(friend);
      } else if (isOutgoing) {
        outgoing.push(friend);
      } else {
        incoming.push(friend);
      }
    }

    return { friends, incoming, outgoing };
  }

  async search(userId: string, query: string): Promise<PublicProfile[]> {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: userId },
        name: { contains: trimmed, mode: 'insensitive' }
      },
      take: 20
    });

    const existing = await this.relatedIds(userId);
    const candidates = users.filter((user) => !existing.has(user.id));
    const profiles = await this.profiles.getPublicProfiles(candidates.map((user) => user.id));

    return candidates
      .map((user) => profiles.get(user.id))
      .filter((profile): profile is PublicProfile => profile !== undefined);
  }

  async request(userId: string, targetId: string): Promise<FriendResult> {
    if (userId === targetId) {
      return { error: 'CANNOT_FRIEND_SELF' };
    }

    const target = await this.prisma.user.findUnique({ where: { id: targetId } });

    if (!target) {
      return { error: 'USER_NOT_FOUND' };
    }

    if ((await this.countFriends(userId)) >= MAX_FRIENDS) {
      return { error: 'FRIEND_LIMIT_REACHED' };
    }

    const existing = await this.findBetween(userId, targetId);

    if (existing?.status === 'ACCEPTED') {
      return { error: 'ALREADY_FRIENDS' };
    }

    if (existing && existing.addresseeId === userId) {
      return this.accept(userId, targetId);
    }

    return this.prisma
      .$transaction(
        async (tx) => {
          const concurrent = await tx.friendship.findFirst({
            where: {
              OR: [
                { requesterId: targetId, addresseeId: userId },
                { requesterId: userId, addresseeId: targetId }
              ]
            }
          });

          if (concurrent?.status === 'ACCEPTED') {
            return { error: 'ALREADY_FRIENDS' } as const;
          }

          if (concurrent && concurrent.addresseeId === userId) {
            await tx.friendship.update({
              where: { id: concurrent.id },
              data: { status: 'ACCEPTED', acceptedAt: new Date() }
            });

            return { ok: true } as const;
          }

          await tx.friendship.upsert({
            where: { requesterId_addresseeId: { requesterId: userId, addresseeId: targetId } },
            create: { requesterId: userId, addresseeId: targetId },
            update: { status: 'PENDING' }
          });

          return { ok: true } as const;
        },
        { isolationLevel: 'Serializable' }
      )
      .catch(() => ({ ok: true }) as const);
  }

  async accept(userId: string, requesterId: string): Promise<FriendResult> {
    const row = await this.prisma.friendship.findUnique({
      where: { requesterId_addresseeId: { requesterId, addresseeId: userId } }
    });

    if (!row || row.status !== 'PENDING') {
      return { error: 'REQUEST_NOT_FOUND' };
    }

    await this.prisma.friendship.update({
      where: { id: row.id },
      data: { status: 'ACCEPTED', acceptedAt: new Date() }
    });

    return { ok: true };
  }

  async decline(userId: string, otherId: string): Promise<FriendResult> {
    const removed = await this.prisma.friendship.deleteMany({
      where: {
        status: 'PENDING',
        OR: [
          { requesterId: otherId, addresseeId: userId },
          { requesterId: userId, addresseeId: otherId }
        ]
      }
    });

    return removed.count === 0 ? { error: 'REQUEST_NOT_FOUND' } : { ok: true };
  }

  async remove(userId: string, otherId: string): Promise<FriendResult> {
    const removed = await this.prisma.friendship.deleteMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId, addresseeId: otherId },
          { requesterId: otherId, addresseeId: userId }
        ]
      }
    });

    return removed.count === 0 ? { error: 'REQUEST_NOT_FOUND' } : { ok: true };
  }

  async areFriends(userId: string, otherId: string): Promise<boolean> {
    const row = await this.findBetween(userId, otherId);

    return row?.status === 'ACCEPTED';
  }

  async countFriends(userId: string): Promise<number> {
    return this.prisma.friendship.count({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }]
      }
    });
  }

  private async findBetween(userId: string, otherId: string) {
    return this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: otherId },
          { requesterId: otherId, addresseeId: userId }
        ]
      }
    });
  }

  private async relatedIds(userId: string): Promise<Set<string>> {
    const rows = await this.prisma.friendship.findMany({
      where: { OR: [{ requesterId: userId }, { addresseeId: userId }] },
      select: { requesterId: true, addresseeId: true }
    });

    return new Set(rows.flatMap((row) => [row.requesterId, row.addresseeId]));
  }
}

export type { FriendshipStatus };
