import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../../generated/prisma/client';

/**
 * Доступ к Postgres.
 *
 * Клиент поднимается на драйверном адаптере `@prisma/adapter-pg`: под Bun
 * это единственный поддерживаемый путь — нативный движок Prisma рассчитан
 * на Node и в Bun работает нестабильно.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL не задан — скопируйте apps/server/.env.example в .env');
    }

    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Postgres подключён');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
