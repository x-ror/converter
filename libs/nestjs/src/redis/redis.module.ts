import { type DynamicModule, Global, Module } from '@nestjs/common';
import type { RedisModuleOptions } from './interfaces';
import { REDIS_MODULE_OPTIONS } from './redis.di';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static forRootAsync(options: RedisModuleOptions): DynamicModule {
    return {
      global: options.isGlobal || false,
      module: RedisModule,
      imports: options.imports || [],
      providers: [
        {
          provide: REDIS_MODULE_OPTIONS,
          useFactory: async (...args: any[]) => await options.useFactory?.(...args),
          inject: options.inject || [],
        },
      ],
    };
  }
}
