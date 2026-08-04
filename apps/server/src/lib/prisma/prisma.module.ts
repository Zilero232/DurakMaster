import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

/**
 * Глобальный модуль: соединение с БД одно на процесс, а нужен доступ
 * почти в каждом модуле — иначе пришлось бы импортировать его повсюду.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
