import type { MyProfile } from '@durak-master/schemas';
import type { Request } from 'express';

import { setAvatarInputSchema, setNameInputSchema } from '@durak-master/schemas';
import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';

import {
  AppBadRequestException,
  AppUnsupportedMediaTypeException,
  AuthGuard,
  CurrentUserId
} from '../../common';
import { detectImageType } from './lib';
import { AvatarStorageService, ProfilesService } from './services';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(
    private readonly profiles: ProfilesService,
    private readonly storage: AvatarStorageService
  ) {}

  @Get('me')
  async getMyProfile(@CurrentUserId() userId: string): Promise<MyProfile> {
    return this.profiles.ensureProfile(userId);
  }

  @Patch('me/name')
  async setName(@CurrentUserId() userId: string, @Body() body: unknown): Promise<MyProfile> {
    const { name } = setNameInputSchema.parse(body);

    return this.profiles.setName(userId, name);
  }

  @Patch('me/avatar')
  async setAvatar(@CurrentUserId() userId: string, @Body() body: unknown): Promise<MyProfile> {
    const { seed } = setAvatarInputSchema.parse(body);

    return this.profiles.setAvatar(userId, seed);
  }

  @Post('bonus')
  async claimBonus(@CurrentUserId() userId: string): Promise<MyProfile> {
    const profile = await this.profiles.claimFreeCredits(userId);

    if (!profile) {
      throw new AppBadRequestException('BAD_REQUEST', 'Bonus is not available yet');
    }

    return profile;
  }

  @Post('avatar')
  async uploadAvatar(@CurrentUserId() userId: string, @Req() request: Request): Promise<MyProfile> {
    const bytes = Buffer.isBuffer(request.body) ? request.body : Buffer.alloc(0);

    if (bytes.length === 0) {
      throw new AppBadRequestException('BAD_REQUEST', 'The request carried no image');
    }

    const mimeType = await detectImageType(bytes);

    if (!mimeType) {
      throw new AppUnsupportedMediaTypeException(
        'UNSUPPORTED_MEDIA_TYPE',
        'Only JPEG, PNG and WebP images are accepted'
      );
    }

    const profile = await this.profiles.ensureProfile(userId);
    const url = await this.storage.save(bytes, mimeType);

    await this.storage.remove(profile.avatarUrl);

    return this.profiles.setAvatarUrl(userId, url);
  }
}
