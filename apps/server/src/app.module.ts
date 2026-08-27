import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

import { HealthController } from './health.controller';
import { AuthModule } from './lib/auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { GameModule } from './modules/game/game.module';
import { AVATAR_DIRECTORY, AVATAR_ROUTE } from './modules/profile/avatar.config';
import { ProfileModule } from './modules/profile/profile.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { SocialModule } from './modules/social/social.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), AVATAR_DIRECTORY),
      serveRoot: AVATAR_ROUTE,
      serveStaticOptions: { index: false, redirect: false }
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    SocialModule,
    GameModule,
    RealtimeModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
