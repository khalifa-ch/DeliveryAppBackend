import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { Repository } from 'typeorm';
import { CreateCarDto } from './car.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(createCarDto: CreateCarDto, user: User): Promise<Car> {
    const car = this.carRepository.create(createCarDto);
    car.user = user;
    return this.carRepository.save(car);
  }

  async findAll(): Promise<Car[]> {
    return this.carRepository.find();
  }
  async findOne(id: number): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return car;
  }
  async update(id: number, attrs: Partial<Car>): Promise<Car> {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    Object.assign(car, attrs);
    return this.carRepository.save(car);
  }
  async remove(id: number) {
    const car = await this.carRepository.findOneBy({ id });
    if (!car) {
      throw new NotFoundException(`car with ID ${id} not found`);
    }
    return this.carRepository.remove(car);
  }

  async getMyCars(userId: number) {
    const cars = await this.carRepository
      .createQueryBuilder('car')
      .where('car.user= :userId', { userId })
      .getMany();

    return cars;
  }
}
