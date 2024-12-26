import { HttpStatus } from '@nestjs/common';
import { DomainError } from './domain.error';

export class NotImplementedError extends DomainError {
  constructor(details?: string, code?: string) {
    super({
      message: 'Not implemented',
      code: code || 'GENERIC.NOT_IMPLEMENTED',
      status: HttpStatus.NOT_IMPLEMENTED,
      data: { details },
    });
  }
}
