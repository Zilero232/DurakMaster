import { Module } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { AvatarStorageService, ProfilesService } from './services';

@Module({
  controllers: [ProfileController],
  providers: [AvatarStorageService, ProfilesService],
  exports: [ProfilesService]
})
export class ProfileModule {}
