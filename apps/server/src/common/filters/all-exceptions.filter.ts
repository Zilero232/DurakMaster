import type { ApiErrorCode } from '@durak-master/schemas';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';

import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { isNonNullish } from 'remeda';

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  413: 'PAYLOAD_TOO_LARGE',
  415: 'UNSUPPORTED_MEDIA_TYPE'
};

const codeForStatus = (status: number): ApiErrorCode => STATUS_TO_CODE[status] ?? 'INTERNAL_ERROR';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      const status = exception.getStatus();
      const hasCode = typeof payload === 'object' && isNonNullish(payload) && 'code' in payload;

      response
        .status(status)
        .json(hasCode ? payload : { code: codeForStatus(status), error: exception.message });

      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : String(exception));

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ code: 'INTERNAL_ERROR', error: 'Internal server error' });
  }
}
