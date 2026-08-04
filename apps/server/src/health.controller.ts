import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'durakmaster-api',
      nodeId: process.env.NODE_ID ?? 'unknown',
    };
  }
}
