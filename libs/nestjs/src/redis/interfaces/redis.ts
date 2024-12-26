import type { ModuleMetadata } from '@nestjs/common';
import type { RedisOptions as IoRedisRedisOptions } from 'ioredis';

export interface RedisModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useFactory?: (...args: any[]) => Promise<RedisOptions>;
  inject?: any[];
}

export type RedisOptions = IoRedisRedisOptions & { persistentDb?: number };
