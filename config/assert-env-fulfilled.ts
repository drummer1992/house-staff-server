import { object, string } from 'sito'

const required = () => string().notEmpty().required()

// Required env vars — startup throws if any is missing.
const envSchema = object({
  PORT          : required(),
  NODE_ENV      : required(),
  SESSION_SECRET: required(),
  JWT_SECRET    : required(),

  GOOGLE_CLIENT_ID    : required(),
  GOOGLE_CLIENT_SECRET: required(),
  GOOGLE_CALLBACK_URL : required(),
  FRONTEND_URL        : required(),

  DB_HOST          : required(),
  DB_PORT          : required(),
  POSTGRES_USER    : required(),
  POSTGRES_PASSWORD: required(),
  POSTGRES_DB      : required(),
  DB_MIN_POOL_SIZE : required(),
  DB_MAX_POOL_SIZE : required(),
})

await envSchema.assert(process.env)
