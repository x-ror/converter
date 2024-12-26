import { HttpStatus } from '@nestjs/common';
import { DomainError } from './domain.error';

export class BadGatewayError extends DomainError {
  constructor(details?: string, code?: string) {
    super({
      message: 'Request cannot be processed due to invalid data provided',
      code: code || 'GENERIC.BAD_GATEWAY',
      status: HttpStatus.BAD_GATEWAY,
      data: {
        details,
      },
    });
  }
}
