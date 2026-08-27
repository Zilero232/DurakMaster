import type { ApiErrorCode } from '@durak-master/schemas';

import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  PayloadTooLargeException,
  UnauthorizedException,
  UnsupportedMediaTypeException
} from '@nestjs/common';

const body = (code: ApiErrorCode, error: string) => ({ code, error });

export class AppBadRequestException extends BadRequestException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppUnauthorizedException extends UnauthorizedException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppForbiddenException extends ForbiddenException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppNotFoundException extends NotFoundException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppPayloadTooLargeException extends PayloadTooLargeException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}

export class AppUnsupportedMediaTypeException extends UnsupportedMediaTypeException {
  constructor(code: ApiErrorCode, error: string) {
    super(body(code, error));
  }
}
