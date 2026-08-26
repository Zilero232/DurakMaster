import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthController } from './health.controller';
import { AuthModule } from './lib/auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { GameModule } from './modules/game/game.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    GameModule,
    RealtimeModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
