import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import helmet from 'helmet';

import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  // Сырой WebSocket вместо Socket.IO: для пошаговой игры дополнительный
  // протокол поверх WS не нужен, а `ws` — самый распространённый и лёгкий.
  app.useWebSocketAdapter(new WsAdapter(app));

  app.use(helmet());

  // Origin'ы Tauri (tauri://localhost) браузерный CORS не затрагивает —
  // перечисляем только веб-клиент.
  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: origins, credentials: true });

  const port = Number(process.env.PORT ?? 4000);

  await app.listen(port);

  // biome-ignore lint/suspicious/noConsole: стартовое сообщение сервера
  console.log(`DurakMaster API: http://localhost:${port}`);
};

void bootstrap();
