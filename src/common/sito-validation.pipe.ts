import { Injectable, type PipeTransform } from '@nestjs/common'
import type { GenericValidator } from 'sito'

@Injectable()
export class SitoValidationPipe implements PipeTransform {
  constructor(private readonly schema: GenericValidator) {
  }

  async transform(value: unknown): Promise<unknown> {
    await this.schema.assert(value)

    return value
  }
}
