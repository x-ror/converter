import { Global, Module } from '@nestjs/common';

import { RequestContextModule } from '../context';
import { LoggerService } from './logger.service';

export const LOGGER_SERVICE = Symbol('CURRENCY_LOGGER_SERVICE');

@Global()
@Module({
  imports: [RequestContextModule],
  providers: [
    {
      provide: LOGGER_SERVICE,
      useClass: LoggerService,
    },
  ],
  exports: [LOGGER_SERVICE],
})
export class LoggerModule {}
