import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Env } from './env.schema';

import { parseOrigins } from './cors';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get<K extends keyof Env>(key: K): Env[K] {
    return this.config.get(key, { infer: true });
  }

  get isDevelopment(): boolean {
    return this.get('NODE_ENV') !== 'production';
  }

  get publicUrl(): string {
    return this.get('PUBLIC_URL') ?? this.get('BETTER_AUTH_URL');
  }

  get origins(): string[] {
    return parseOrigins(this.get('CORS_ORIGINS'));
  }
}
