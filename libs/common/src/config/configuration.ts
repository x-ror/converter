import { join } from 'node:path';

import { Logger } from '@nestjs/common';
import type { ConfigFactory, ConfigModuleOptions } from '@nestjs/config';

// Your config should vary between deploys, and you should not be sharing values between environments.
// https://12factor.net/config
export const envFileName = '.env';

const envFilePath = (folder: string, file: string): string => join(folder, file);

export interface Config {
  envFileDir: string;
  validationSchema?: any;
  validationOptions: Record<string, any>;
  load?: ConfigFactory[];
}

export const configuration = ({
  envFileDir,
  validationSchema,
  validationOptions,
  load,
}: Config): ConfigModuleOptions => ({
  cache: true,
  isGlobal: true,
  load,
  envFilePath: envFilePath(envFileDir, envFileName),
  validationSchema: validationSchema,
  validationOptions: validationOptions,
  validate: (record): Record<string, any> => {
    const { error, value: validatedConfig } = validationSchema.validate(record, {
      allowUnknown: true,
      ...validationOptions,
    });
    if (error) {
      // NOTE: Environment variables validation failed, service will crash
      // We try to log as much information as possible
      try {
        const logger = new Logger('configuration');
        logger.error(`Config validation error: ${error.message}`, null, 'Config validation');
      } catch (_loggerError) {
        console.error('Config validation error:', error); // eslint-disable-line no-console
      }

      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedConfig;
  },
});

export default configuration;
