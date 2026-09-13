import type { Leaderboard } from '@durak-master/schemas';

import { LEADERBOARD_SIZE } from '@durak-master/schemas';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../lib/prisma/prisma.service';
import { toPublicProfile } from '../../profile';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async top(userId: string): Promise<Leaderboard> {
    const rows = await this.prisma.profile.findMany({
      where: { gamesPlayed: { gt: 0 } },
      orderBy: [{ rating: 'desc' }, { gamesWon: 'desc' }],
      take: LEADERBOARD_SIZE,
      include: { user: true }
    });

    const entries = rows.map((row, index) => ({
      rank: index + 1,
      profile: toPublicProfile(
        { userId: row.userId, name: row.user.name, image: row.user.image },
        row,
        false
      )
    }));

    const mine = await this.prisma.profile.findUnique({ where: { userId } });

    if (!mine || mine.gamesPlayed === 0) {
      return { entries, myRank: null };
    }

    const ahead = await this.prisma.profile.count({
      where: { gamesPlayed: { gt: 0 }, rating: { gt: mine.rating } }
    });

    return { entries, myRank: ahead + 1 };
  }
}
