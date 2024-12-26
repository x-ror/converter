import { DomainError } from './domain.error';

export class NotFoundError extends DomainError {
  constructor(details?: string) {
    super({
      message: 'Resource was not found',
      code: 'GENERIC.NOT_FOUND',
      status: 404,
      data: {
        details,
      },
    });
  }
}
