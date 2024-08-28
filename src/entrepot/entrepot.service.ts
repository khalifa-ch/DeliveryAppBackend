import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entrepot } from './entrepot.entity';
import { Repository } from 'typeorm';
import { CreateEntrepotDto } from './entrepot.dto';

@Injectable()
export class EntrepotService {
  constructor(
    @InjectRepository(Entrepot)
    private readonly entrepotRepository: Repository<Entrepot>,
  ) {}

  async create(createEntrepotDto: CreateEntrepotDto): Promise<Entrepot> {
    const entrepot = this.entrepotRepository.create(createEntrepotDto);
    return this.entrepotRepository.save(entrepot);
  }

  async findAll(): Promise<Entrepot[]> {
    return this.entrepotRepository.find();
  }
  async findOne(id: number): Promise<Entrepot> {
    const entrepot = await this.entrepotRepository.findOneBy({ id });
    if (!entrepot) {
      throw new NotFoundException(`Entrepot with ID ${id} not found`);
    }
    return entrepot;
  }

  async update(id: number, attrs: Partial<Entrepot>) {
    const entrepot = await this.entrepotRepository.findOneBy({ id });
    if (!entrepot) {
      throw new NotFoundException(`entrepot with ID ${id} not found`);
    }
    Object.assign(entrepot, attrs);
    return this.entrepotRepository.save(entrepot);
  }

  async remove(id: number) {
    const entrepot = await this.entrepotRepository.findOneBy({ id });
    if (!entrepot) {
      throw new NotFoundException(`entrepot with ID ${id} not found`);
    }
    return this.entrepotRepository.remove(entrepot);
  }
}
