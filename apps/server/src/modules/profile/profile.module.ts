import { Module } from '@nestjs/common';

import { AvatarStorageService } from './avatar-storage.service';
import { ProfileController } from './profile.controller';
import { ProfilesService } from './profiles.service';

@Module({
  controllers: [ProfileController],
  providers: [AvatarStorageService, ProfilesService],
  exports: [ProfilesService]
})
export class ProfileModule {}
