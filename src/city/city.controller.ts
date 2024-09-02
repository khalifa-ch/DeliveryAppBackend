import { Controller, Get, UseGuards } from '@nestjs/common';
import { CityService } from './city.service';
import { JwtGuard } from 'src/guards/jwt-auth.guard';

@Controller('city')
@UseGuards(JwtGuard)
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
