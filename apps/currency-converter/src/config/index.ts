import { join } from 'node:path';

export const envFileDir = join(__dirname, '../../'); // level as `src`, not in

export const logFileDir = join(__dirname, '../../'); // level as `src`, not in
import * as validations from './env.validation';
import { redisConfig } from './redis.config';

const config = {
  envFileDir,
  logFileDir,
  ...validations,
  load: [redisConfig],
};

export default config;
