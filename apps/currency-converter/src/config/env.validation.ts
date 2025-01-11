import Joi from 'joi';

import {
  commonAppValidation,
  logsValidation,
  redisValidation,
} from '@sdk/common/config/components';

export const validationSchema = Joi.object({
  ...redisValidation,
  ...logsValidation,
  ...commonAppValidation,
});

export const validationOptions = {
  abortEarly: false,
};
