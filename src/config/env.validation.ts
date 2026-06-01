import Joi from 'joi'

/**
 * Single source of truth for required environment variables (NestJS side).
 * Mirrors the legacy `config/assert-env-fulfilled.ts` and additionally enforces
 * JWT_SECRET, which is required at runtime but was missing from the legacy list.
 */
export const envValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  DB_MIN_POOL_SIZE: Joi.number().required(),
  DB_MAX_POOL_SIZE: Joi.number().required(),
})
