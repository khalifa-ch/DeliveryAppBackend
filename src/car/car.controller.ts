import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto, UpdateCarDto } from './car.dto';
import { Car } from './car.entity';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carService.create(createCarDto);
  }

  @Get()
  findAll(): Promise<Car[]> {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Car> {
    return this.carService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    return this.carService.update(id, updateCarDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.carService.remove(id);
  }
}
