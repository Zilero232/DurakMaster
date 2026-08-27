import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import helmet from 'helmet';

import { AppModule } from './app.module';

import 'reflect-metadata';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));

  app.use(helmet());

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:8081')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: origins, credentials: true });

  const port = Number(process.env.PORT ?? 4000);

  await app.listen(port);

  console.log(`DurakMaster API: http://localhost:${port}`);
};

void bootstrap();
