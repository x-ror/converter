import { DomainError } from './domain.error';

export class TooManyRequestError extends DomainError {
  constructor(details?: string, code?: string) {
    super({
      message: 'Too many requests',
      code: code || 'GENERIC.TOO_MANY_REQUEST',
      status: 429,
      data: {
        details,
      },
    });
  }
}
