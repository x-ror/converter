import type { OnModuleDestroy } from '@nestjs/common';
import type Redis from 'ioredis';

export abstract class AbstractRedisService implements OnModuleDestroy {
  protected redis: Redis;

  async onModuleDestroy(): Promise<void> {
    try {
      this.redis.disconnect();
    } catch {}
  }

  async set(
    key: string,
    value: string | number,
    opts: {
      ttl?: number;
      nx?: boolean;
      ifNotExists?: boolean;
      xx?: boolean;
      extendOnly?: boolean;
    } = {},
  ) {
    const args:
      | [string, string | number]
      | [string, string | number, 'NX']
      | [string, string | number, 'XX']
      | [string, string | number, 'EX', number]
      | [string, string | number, 'EX', number, 'NX']
      | [string, string | number, 'EX', number, 'XX'] = [key, value];

    if (opts?.ttl) {
      args.push('EX', opts.ttl);
    }

    const nx = opts?.nx || opts?.ifNotExists;
    const xx = opts?.xx || opts?.extendOnly;
    if (nx && xx) {
      throw new Error(`NX and XX are mutually exclusive - ${this.constructor.name}`);
    }
    if (nx) {
      args.push('NX');
    }

    if (xx) {
      args.push('XX');
    }

    return this.redis.set(...args);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }
}
