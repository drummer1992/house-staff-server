import { Injectable, type PipeTransform } from '@nestjs/common'
import type { Schema } from 'joi'
import { ValidationError } from '../../errors/index.js'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Schema) {
  }

  transform(value: unknown): unknown {
    const { error, value: validated } = this.schema.validate(value)

    if (error) {
      throw new ValidationError(error.message)
    }

    return validated
  }
}
