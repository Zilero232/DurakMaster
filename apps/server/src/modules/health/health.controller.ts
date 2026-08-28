import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

import { PrismaService } from '../../lib/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prisma: PrismaService,
    private readonly database: PrismaHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.database.pingCheck('database', this.prisma)]);
  }
}
