import { Injectable } from '@nestjs/common';

import type { Auth } from './auth.config';

import { PrismaService } from '../prisma/prisma.service';
import { createAuth } from './auth.config';

@Injectable()
export class AuthService {
  readonly auth: Auth;

  constructor(prisma: PrismaService) {
    this.auth = createAuth(prisma);
  }

  async resolveUserId(headers: Headers): Promise<string | null> {
    try {
      const session = await this.auth.api.getSession({ headers });

      return session?.user.id ?? null;
    } catch {
      return null;
    }
  }

  async resolveSessionToken(headers: Headers): Promise<string | null> {
    try {
      const session = await this.auth.api.getSession({ headers });

      return session?.session.token ?? null;
    } catch {
      return null;
    }
  }
}
