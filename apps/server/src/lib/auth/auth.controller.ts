import type { Request, Response } from 'express';

import { All, Controller, Get, Req, Res } from '@nestjs/common';

import { AuthService } from './auth.service';

const BODYLESS_METHODS = new Set(['GET', 'HEAD']);

const readBody = (request: Request): string | undefined => {
  if (BODYLESS_METHODS.has(request.method) || request.body === undefined) {
    return undefined;
  }

  return JSON.stringify(request.body);
};

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ws-token')
  async getWsToken(@Req() request: Request): Promise<{ token: string | null }> {
    const headers = new Headers();

    for (const [name, value] of Object.entries(request.headers)) {
      if (typeof value === 'string') {
        headers.set(name, value);
      }
    }

    return { token: await this.authService.resolveSessionToken(headers) };
  }

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

    const body = readBody(request);

    if (body) {
      headers.set('content-length', String(Buffer.byteLength(body)));
    } else {
      headers.delete('content-length');
      headers.delete('content-type');
    }

    const authResponse = await this.authService.auth.handler(
      new Request(url.toString(), { method: request.method, headers, body })
    );

    response.status(authResponse.status);

    authResponse.headers.forEach((value, key) => {
      response.append(key, value);
    });

    response.send(await authResponse.text());
  }
}
