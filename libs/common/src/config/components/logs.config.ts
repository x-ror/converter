import Joi from 'joi';

import { registerAs } from '@nestjs/config';

const logFileRE = /[a-zA-Z1-9_.]\.log/;

export const logsConfig = registerAs('logs', () => ({
  errorFile: process.env.LOG_ERROR_FILE,
  combinedFile: process.env.LOG_COMBINED_FILE,
  level: process.env.LOG_LEVEL,
  json: process.env.LOG_IN_JSON?.toLowerCase() === 'true',
}));

export const logsValidation = {
  LOG_ERROR_FILE: Joi.string() //
    .optional()
    .allow('')
    .pattern(logFileRE),
  LOG_COMBINED_FILE: Joi.string() //
    .optional()
    .allow('')
    .pattern(logFileRE),
  LOG_LEVEL: Joi.string() //
    .equal('trace', 'debug', 'info', 'warn', 'error', 'fatal')
    .default('info'),
  LOG_IN_JSON: Joi.string() //
    .allow('')
    .equal('true', 'false'),
};
