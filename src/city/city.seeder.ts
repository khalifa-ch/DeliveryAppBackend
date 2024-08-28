import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CitySeeder {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async seed() {
    const cities = [
      'Tunis', 'Ariana', 'Ben Arous', 'Mannouba', 'Nabeul', 
      'Zaghouan', 'Bizerte', 'Béja', 'Jendouba', 'EL Kef', 
      'Siliana', 'Sousse', 'Kairouan', 'Kasserine', 
      'Monastir', 'Mahdia', 'Sfax', 'Sidi Bouzid ', 'Gafsa', 
      'Gabès', 'Tozeur', 'Kébilli', 'Médenine', 'Tataouine'
    ];

    for (const cityName of cities) {
      const city = this.cityRepository.create({
        name: cityName,
      });

      await this.cityRepository.save(city);
    }
  }
}
