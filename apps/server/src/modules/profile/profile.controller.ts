import type { Request } from 'express';

import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Headers as RequestHeaders,
  UnauthorizedException
} from '@nestjs/common';

import { AuthService } from '../../lib/auth/auth.service';
import { AvatarStorageService } from './avatar-storage.service';
import { AVATAR_MAX_BYTES } from './avatar.config';
import { detectImageType } from './avatar.lib';
import { ProfilesService } from './profiles.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly auth: AuthService,
    private readonly profiles: ProfilesService,
    private readonly storage: AvatarStorageService
  ) {}

  @Post('avatar')
  async uploadAvatar(@Req() request: Request, @RequestHeaders() headers: Record<string, string>) {
    const userId = await this.auth.resolveUserId(new Headers(headers));

    if (!userId) {
      throw new UnauthorizedException();
    }

    const bytes = await this.readBody(request);
    const mimeType = detectImageType(bytes);

    if (!mimeType) {
      throw new BadRequestException('Only JPEG, PNG and WebP images are accepted');
    }

    const profile = await this.profiles.ensureProfile(userId);
    const url = await this.storage.save(bytes, mimeType);

    await this.storage.remove(profile.avatarUrl);

    return this.profiles.setAvatarUrl(userId, url);
  }

  private async readBody(request: Request): Promise<Buffer> {
    const chunks: Buffer[] = [];
    let size = 0;

    for await (const chunk of request) {
      size += chunk.length;

      if (size > AVATAR_MAX_BYTES) {
        throw new BadRequestException('The image is larger than 512 KB');
      }

      chunks.push(chunk as Buffer);
    }

    return Buffer.concat(chunks);
  }
}
