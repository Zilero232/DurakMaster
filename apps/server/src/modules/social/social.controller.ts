import type {
  AchievementState,
  FriendList,
  Leaderboard,
  PublicProfile
} from '@durak-master/schemas';

import { achievementIdSchema } from '@durak-master/schemas';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import type { FriendResult } from './services';

import { AppBadRequestException, AuthGuard, CurrentUserId } from '../../common';
import { AchievementsService, FriendsService, LeaderboardService } from './services';

const ensureOk = (result: FriendResult): void => {
  if (result.isErr()) {
    throw new AppBadRequestException('BAD_REQUEST', result.error);
  }
};

@Controller()
@UseGuards(AuthGuard)
export class SocialController {
  constructor(
    private readonly friends: FriendsService,
    private readonly achievements: AchievementsService,
    private readonly leaderboard: LeaderboardService
  ) {}

  @Get('friends')
  async listFriends(@CurrentUserId() userId: string): Promise<FriendList> {
    return this.friends.list(userId);
  }

  @Get('friends/search')
  async searchFriends(
    @CurrentUserId() userId: string,
    @Query('query') query = ''
  ): Promise<PublicProfile[]> {
    return this.friends.search(userId, query);
  }

  @Post('friends/:userId/request')
  async requestFriend(
    @CurrentUserId() userId: string,
    @Param('userId') targetId: string
  ): Promise<void> {
    ensureOk(await this.friends.request(userId, targetId));
  }

  @Post('friends/:userId/accept')
  async acceptFriend(
    @CurrentUserId() userId: string,
    @Param('userId') requesterId: string
  ): Promise<void> {
    ensureOk(await this.friends.accept(userId, requesterId));
  }

  @Post('friends/:userId/decline')
  async declineFriend(
    @CurrentUserId() userId: string,
    @Param('userId') otherId: string
  ): Promise<void> {
    ensureOk(await this.friends.decline(userId, otherId));
  }

  @Delete('friends/:userId')
  async removeFriend(
    @CurrentUserId() userId: string,
    @Param('userId') otherId: string
  ): Promise<void> {
    ensureOk(await this.friends.remove(userId, otherId));
  }

  @Get('achievements')
  async listAchievements(@CurrentUserId() userId: string): Promise<AchievementState[]> {
    return this.achievements.list(userId);
  }

  @Post('achievements/claim')
  async claimAchievement(
    @CurrentUserId() userId: string,
    @Body() body: unknown
  ): Promise<{ coins: number }> {
    const { achievementId } = z.object({ achievementId: achievementIdSchema }).parse(body);

    const result = await this.achievements.claim(userId, achievementId);

    if (result.isErr()) {
      throw new AppBadRequestException('BAD_REQUEST', result.error);
    }

    return result.value;
  }

  @Get('leaderboard')
  async getLeaderboard(@CurrentUserId() userId: string): Promise<Leaderboard> {
    return this.leaderboard.top(userId);
  }
}
