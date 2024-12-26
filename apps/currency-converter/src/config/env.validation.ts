import Joi from 'joi';
import { redisValidation } from './redis.config';

export const validationSchema = Joi.object({
  ...redisValidation,
});

export const validationOptions = {
  abortEarly: false,
};
