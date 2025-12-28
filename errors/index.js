export class ApiError extends Error {
  constructor(message, status) {
    super(message)

    this.message = message
    this.status = status
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(message, 500)
  }
}

export class NotAuthenticatedError extends ApiError {
  constructor(message = 'Not authenticated') {
    super(message, 401)
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation error', params = {}) {
    super(message, 400)

    this.path = params.path
    this.key = params.key
    this.value = params.value
    this.payload = params.payload
  }
}

export const notFoundAssert = (condition, message) => {
  if (!condition) {
    throw new NotFoundError(message)
  }
}

export const validationAssert = (condition, message) => {
  if (!condition) {
    throw new ValidationError(message)
  }
}