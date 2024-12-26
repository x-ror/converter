import { HttpException } from '@nestjs/common';

export interface IDomainErrorProps {
  message: string;
  status?: number;
  code: string;
  data?: object;
}

/** Base error class that is supported by default NestJS exception filter */
export class BaseError extends HttpException {
  private readonly code: string;
  private readonly data?: object;

  constructor({ message, status = 500, code, data }: IDomainErrorProps) {
    super(message, status);

    this.code = code;
    this.data = data;
  }

  public getResponse(): object {
    const response = super.getResponse();

    if (typeof response === 'string') {
      return {
        message: response,
        statusCode: this.getStatus(),
        code: this.code,
        data: this.data,
      };
    }

    return {
      ...response,
      statusCode: this.getStatus(),
      code: this.code,
      data: this.data,
    };
  }
}
