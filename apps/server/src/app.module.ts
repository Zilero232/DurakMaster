import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AppConfigModule, AppConfigService, loggerOptions } from './config';
import { AuthModule } from './lib/auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { GameModule } from './modules/game';
import { HealthModule } from './modules/health';
import { ProfileModule } from './modules/profile';
import { RealtimeModule } from './modules/realtime';
import { SocialModule } from './modules/social';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => loggerOptions(config.isDevelopment)
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    SocialModule,
    GameModule,
    RealtimeModule,
    HealthModule
  ]
})
export class AppModule {}
