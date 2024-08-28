import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.create(createStoreDto);
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
}
