import { BadRequestException, NotFoundException } from '@nestjs/common'

export function validationAssert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new BadRequestException(message)
  }
}

export function notFoundAssert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new NotFoundException(message)
  }
}
