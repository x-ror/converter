import omit from 'lodash.omit';
import { InjectPinoLogger } from 'nestjs-pino';
import type { PinoLogger } from 'nestjs-pino';

import { Inject, Injectable } from '@nestjs/common';
import type { LoggerService as NestLoggerService } from '@nestjs/common';

import { RequestContextService } from '../context';
import type { LoggingContextInterface } from './logger.interface';

@Injectable()
export class LoggerService implements NestLoggerService {
  private stackLengthLimit = 1000;

  constructor(
    @InjectPinoLogger() private readonly logger: PinoLogger,
    @Inject(RequestContextService) private readonly contextService: RequestContextService,
  ) {}

  verbose(message: any, context?: string | LoggingContextInterface): void {
    const contextString = typeof context === 'string' ? context : undefined;
    this.logger.trace?.(this.getMessage(message, context), contextString);
  }

  debug(message: any, context?: string | LoggingContextInterface, isDebugEnabled = true): void {
    if (isDebugEnabled) {
      const contextString = typeof context === 'string' ? context : undefined;
      this.logger.debug?.(this.getMessage(message, context), contextString);
    }
  }

  log(message: any, context?: string | LoggingContextInterface): void {
    const contextString = typeof context === 'string' ? context : undefined;
    this.logger.info(this.getMessage(message, context), contextString);
  }

  warn(message: any, context?: string | LoggingContextInterface): void {
    const contextString = typeof context === 'string' ? context : undefined;
    this.logger.warn(this.getMessage(message, context), contextString);
  }

  /**
   * Method to log errors
   * @param error {Error} - error object
   * @param context {string | LoggingContextInterface} - context object
   */
  error(error: unknown, context?: string | LoggingContextInterface): void {
    if (this.isErrorLike(error)) {
      const errorContext: any = this.createContextObject(context);
      if (this.checkIfHasResponse(error)) {
        errorContext.httpDetails = {
          url: error.response.config?.url,
          status: error.response.status,
          resData:
            typeof error.response.data === 'object'
              ? JSON.stringify(error.response.data)
              : error.response.data,
        };

        this.logger.error(this.getMessage(error.message, errorContext));
        return;
      }

      this.logger.error(this.getMessage(error, errorContext));
      return;
    }

    this.logger.error(this.getMessage(error, context));
    return;
  }

  private isErrorLike(error: unknown): error is Error {
    if (!error) {
      return false;
    }

    return (
      ({}.hasOwnProperty.call(error, 'message') && {}.hasOwnProperty.call(error, 'stack')) ||
      error instanceof Error
    );
  }

  private checkIfHasResponse(error: Error): error is Error & { response: any } {
    return 'response' in error;
  }

  private createContextObject(context?: string | LoggingContextInterface) {
    let logContext: { [key: string]: any } = {};
    if (typeof context === 'string') {
      logContext.name = context;
    } else if (context) {
      logContext = context;
    }

    return logContext;
  }

  private formatError(error: unknown) {
    if (!error) {
      return undefined;
    }

    if (typeof error === 'string') {
      return error.substring(0, this.stackLengthLimit);
    }

    return error;
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: this method is complex by design
  private getMessage(message: any, context?: string | LoggingContextInterface) {
    const { traceId, reqId, sessionId, url } = this.contextService.getRequestHeaders();

    const details = this.createContextObject(context);
    const logData: Record<string, string | number | Record<string, string> | undefined> = {
      reqId,
      traceId,
      sessionId,
      url,
      logTime: Date.now(),
      details,
    };

    if (message && 'object' === typeof message) {
      let error: Error | null = null;

      // message.message is a case from some internal nest errors
      if (this.isErrorLike(message.message)) {
        error = message.message;
      } else if (this.isErrorLike(message)) {
        error = message;
      } else if (this.isErrorLike(message.error)) {
        error = message.error;
      } else if (this.isErrorLike(message.err)) {
        error = message.err;
      }

      if (error != null) {
        const rest = omit(message, ['stack', 'message', 'error', 'err']);
        Object.assign(logData, {
          ...rest,
          err: this.formatError(error),
        });
      } else {
        Object.assign(logData, message);
      }
    } else {
      Object.assign(logData, { message });
    }

    if (!logData.err && (details.error || details.err)) {
      const errorLike = details.error || details.err;
      if (this.isErrorLike(errorLike)) {
        const rest = omit(details, ['error', 'err']);
        Object.assign(logData, {
          details: rest,
          err: {
            ...errorLike,
            message: errorLike.message,
            stack: errorLike.stack,
          },
        });
      }
    }

    if (!logData.message && logData.error) {
      Object.assign(logData, { message: logData.error });
    }

    return logData;
  }
}
