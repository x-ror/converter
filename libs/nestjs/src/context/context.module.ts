import { RequestContextModule as RCM } from 'nestjs-request-context';

import { Global, Module } from '@nestjs/common';

import { RequestContextService } from './context.service';

@Global()
@Module({
  imports: [RCM],
  providers: [RequestContextService],
  exports: [RequestContextService],
})
export class RequestContextModule {}
