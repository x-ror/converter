import { join } from 'node:path';

export const envFileDir = join(__dirname, '../../'); // level as `src`, not in
export const logFileDir = join(__dirname, '../../'); // level as `src`, not in
import * as validations from './env.validation';

import { commonAppConfig, logsConfig, redisConfig } from '@sdk/common/config/components';

const config = {
  envFileDir,
  logFileDir,
  ...validations,
  load: [commonAppConfig, redisConfig, logsConfig],
};

export default config;
