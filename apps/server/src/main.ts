import type { NestExpressApplication } from '@nestjs/platform-express';

import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import express from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { join } from 'node:path';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common';
import { parseOrigins, validateEnv } from './config';
import {
  AVATAR_DIRECTORY,
  AVATAR_MAX_BYTES,
  AVATAR_MIME_TYPES,
  AVATAR_ROUTE
} from './modules/profile/config';

import 'reflect-metadata';

const env = validateEnv(process.env);

const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

app.useLogger(app.get(Logger));

app.useWebSocketAdapter(new WsAdapter(app));
app.useGlobalFilters(new AllExceptionsFilter());

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use('/profile/avatar', express.raw({ type: [...AVATAR_MIME_TYPES], limit: AVATAR_MAX_BYTES }));

app.use(
  AVATAR_ROUTE,
  express.static(join(process.cwd(), AVATAR_DIRECTORY), { index: false, redirect: false })
);

app.enableCors({ origin: parseOrigins(env.CORS_ORIGINS), credentials: true });
app.enableShutdownHooks();

await app.listen(env.PORT);

app.get(Logger).log(`DurakMaster API on port ${env.PORT}`);
