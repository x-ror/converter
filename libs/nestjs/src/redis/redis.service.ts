import { Redis } from 'ioredis';
import { AbstractRedisService } from './abstract.redis.service';
import type { RedisOptions } from './interfaces';

export class RedisService extends AbstractRedisService {
  constructor(private readonly options: RedisOptions) {
    super();

    this.redis = new Redis(this.options);
  }
}
