import { DomainError } from './domain.error';

export class BadRequestError extends DomainError {
  constructor(details?: string, code?: string) {
    super({
      message: 'Request cannot be processed due to invalid data provided',
      code: code || 'GENERIC.BAD_REQUEST',
      status: 400,
      data: {
        details,
      },
    });
  }
}
