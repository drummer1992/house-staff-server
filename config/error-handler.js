import { ApiError, InternalServerError } from '../errors/index.js'
import logger from '../utils/logger.js'

const errorHandler = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    logger.error('[UNHANDLED ERROR]', err.stack)

    err = new InternalServerError()
  }

  res.status(err.status).json({ message: err.message, statusCode: err.status })
}

export default errorHandler