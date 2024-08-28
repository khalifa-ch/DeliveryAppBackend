import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getAll() {
    return this.cityService.getAll();
  }

  @Get('/names')
  getCityNames() {
    return this.cityService.getCityNames();
  }
}
