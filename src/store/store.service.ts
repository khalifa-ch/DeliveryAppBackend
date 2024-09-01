import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { User } from 'src/user/entities/user.entity';
import { CityService } from 'src/city/city.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private cityService: CityService,
  ) {}

  async create(
    createStoreDto: CreateStoreDto,
    user: User,
    cityId: string,
  ): Promise<Store> {
    const store = this.storeRepository.create(createStoreDto);
    if (!cityId) {
      throw new BadRequestException('plz provide a cityId');
    }
    const city = await this.cityService.findOne(parseInt(cityId));
    store.user = user;
    store.city = city;
    return await this.storeRepository.save(store);
  }
  async getById(id: number) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: number, attrs: Partial<Store>) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    Object.assign(store, attrs);
    return this.storeRepository.save(store);
  }

  async remove(id: number) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return this.storeRepository.remove(store);
  }
  async getAll(): Promise<Store[]> {
    return await this.storeRepository.find();
  }

  async getMyStores(userId: number) {
    const stores = await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.city', 'city')
      .where('store.user= :userId', { userId })
      .getMany();
    return stores;
  }
}
