const VARIABLES = [
  'PORT',
  'NODE_ENV',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'FRONTEND_URL',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_MIN_POOL_SIZE',
  'DB_MAX_POOL_SIZE',
]

VARIABLES.forEach(variable => {
  if (!process.env[variable]) {
    throw new Error(`[${variable}] environment variable is not specified`)
  }
})