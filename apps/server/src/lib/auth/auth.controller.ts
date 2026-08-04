import { All, Controller, Req, Res } from '@nestjs/common';

import { AuthService } from './auth.service';

import type { Request, Response } from 'express';

/**
 * Точка входа better-auth: регистрация, вход, выход, сессия.
 *
 * Библиотека работает с веб-стандартными Request/Response, поэтому запрос
 * Express конвертируется в оба конца вручную.
 */
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All('*splat')
  async handle(@Req() request: Request, @Res() response: Response): Promise<void> {
    const url = new URL(request.originalUrl, `${request.protocol}://${request.get('host')}`);

    const headers = new Headers();

    for (const [key, value] of Object.entries(request.headers)) {
      if (typeof value === 'string') {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join(', '));
      }
    }

    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

    const authResponse = await this.authService.auth.handler(
      new Request(url.toString(), {
        method: request.method,
        headers,
        body: hasBody ? JSON.stringify(request.body) : undefined,
      }),
    );

    response.status(authResponse.status);

    authResponse.headers.forEach((value, key) => {
      // Set-Cookie может прийти несколькими значениями — append сохраняет все.
      response.append(key, value);
    });

    response.send(await authResponse.text());
  }
}
