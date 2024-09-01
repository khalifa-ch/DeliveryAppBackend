import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(@InjectRepository(City) private cityRepo: Repository<City>) {}

  async getAll() {
    return await this.cityRepo.find();
  }
  async getCityNames(): Promise<string[]> {
    const cities = await this.cityRepo.createQueryBuilder('city').getMany();
    const citiesName = cities.map((city) => city.name);
    return citiesName;
  }
  async findOne(id: number): Promise<City> {
    const city = await this.cityRepo.findOneBy({ id });
    if (!city) {
      throw new NotFoundException(`city with ID ${id} not found`);
    }
    return city;
  }
}
