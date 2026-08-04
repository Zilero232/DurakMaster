import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { type Auth, createAuth } from './auth.config';

/**
 * Обёртка над better-auth.
 *
 * Держит единственный экземпляр и даёт остальному коду только то, что ему
 * нужно: проверку сессии. Прямой доступ к `auth.api` оставлен для роутера
 * HTTP-эндпоинтов `/api/auth/*`.
 */
@Injectable()
export class AuthService {
  readonly auth: Auth;

  constructor(prisma: PrismaService) {
    this.auth = createAuth(prisma);
  }

  /**
   * Проверяет сессию по заголовкам и возвращает идентификатор пользователя.
   *
   * Возвращает `null`, если сессии нет или токен недействителен. Вызывающий
   * обязан трактовать `null` как отказ: подставлять идентификатор из
   * клиентских данных нельзя — это позволило бы играть от чужого имени.
   */
  async resolveUserId(headers: Headers): Promise<string | null> {
    try {
      const session = await this.auth.api.getSession({ headers });

      return session?.user.id ?? null;
    } catch {
      return null;
    }
  }
}
