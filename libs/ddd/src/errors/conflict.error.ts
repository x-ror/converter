import { DomainError } from './domain.error';

export interface IConflictErrorProps {
  message?: string;
  code?: string;
  details?: string;
}

export class ConflictError extends DomainError {
  constructor();
  constructor(details?: string);
  constructor(props: IConflictErrorProps);
  constructor(props: string | IConflictErrorProps = {}) {
    const { message, code, details } =
      typeof props === 'string' ? ({ details: props } as IConflictErrorProps) : props;

    super({
      message: message || 'Request cannot be processed due to data conflict',
      code: code || 'GENERIC.CONFLICT',
      status: 409,
      data: {
        details,
      },
    });
  }
}
