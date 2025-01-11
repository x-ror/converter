import Joi from 'joi';

import { registerAs } from '@nestjs/config';

import { EnvEnum } from '@sdk/common';

export const commonAppConfig = registerAs('commonApp', () => ({
  nodeEnv: process.env.NODE_ENV,
  env: process.env.ENV,
  name: process.env.SERVICE_NAME,
  host: process.env.SERVICE_HOST,
  port: Number(process.env.SERVICE_PORT),
  skipShutdownHooks: process.env.SKIP_SHUTDOWN_HOOKS === 'true',
}));

export const commonAppValidation = {
  NODE_ENV: Joi.string()
    .equal(...Object.values(EnvEnum))
    .default('local'),
  ENV: Joi.string()
    .equal(
      '.env',
      '.env.production',
      '.env.production.local',
      '.env.development',
      '.env.development.local',
    )
    .required(),

  SERVICE_NAME: Joi.string().required(),
  SERVICE_HOST: Joi.string() //
    .allow('')
    .required(),
  SERVICE_PORT: Joi.number() //
    .default(3000)
    .required(),
};
