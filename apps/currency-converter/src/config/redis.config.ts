import type { RedisOptions } from 'ioredis';
import Joi from 'joi';

import { registerAs } from '@nestjs/config';
import { MILLISECONDS_IN_SECOND, isEnvTruthful } from '@sdk/common';

export interface RedisConfig extends RedisOptions {
  ttl: number;
  password: string | undefined;
}

export const redisConfig = registerAs(
  'redis',
  (): RedisConfig => ({
    ttl: Number(process.env.REDIS_CACHE_TTL),
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_AUTH,
    tls: isEnvTruthful(process.env.REDIS_TLS) ? {} : undefined,
    db: Number(process.env.REDIS_DB),
  }),
);

export const redisValidation = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_AUTH: Joi.string().allow('').required(),
  REDIS_CACHE_TTL: Joi.number().default(300),
  REDIS_TLS: Joi.boolean().default(false),
  REDIS_DB: Joi.number().default(0),
  REDIS_LOGGING_TIMEOUT: Joi.number().default(10 * MILLISECONDS_IN_SECOND),
};
