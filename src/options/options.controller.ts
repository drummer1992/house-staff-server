import { Controller, Get } from '@nestjs/common'
import { OptionsService } from './options.service.js'

@Controller('options')
export class OptionsController {
  constructor(private readonly options: OptionsService) {
  }

  @Get()
  getAll() {
    return this.options.getAll()
  }
}
