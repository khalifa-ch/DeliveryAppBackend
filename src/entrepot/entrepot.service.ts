import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entrepot } from './entrepot.entity';
import { Repository } from 'typeorm';
import { CreateEntrepotDto } from './entrepot.dto';
import { User } from 'src/user/entities/user.entity';
import { CityService } from 'src/city/city.service';

@Injectable()
export class EntrepotService {
  constructor(
    @InjectRepository(Entrepot)
    private readonly entrepotRepository: Repository<Entrepot>,
    private cityService: CityService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createEntrepotDto: CreateEntrepotDto,
    user: User,
    cityId: string,
  ): Promise<Entrepot> {
    const entrepot = this.entrepotRepository.create(createEntrepotDto);
    const city = await this.cityService.findOne(parseInt(cityId));
    entrepot.user = user;
    entrepot.city = city;
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

  async getMyEntrepot(userId: number) {
    const entrepots = await this.entrepotRepository
      .createQueryBuilder('entrepot')
      .leftJoinAndSelect('entrepot.city', 'city')
      .where('entrepot.user= :userId', { userId })
      .getMany();

    return entrepots;
  }

  async findEntrepotsByDelivererCity(delivererId: number) {
    const deliverer = await this.userRepository.findOne({
      where: { id: delivererId },
      relations: ['city'],
    });

    if (!deliverer) {
      throw new Error('Deliverer not found');
    }

    const entrepots = await this.entrepotRepository
      .createQueryBuilder('entrepot')
      .leftJoinAndSelect('entrepot.city', 'city')
      .where('city.id = :cityId', { cityId: deliverer.city.id })
      .getMany();

    if (!entrepots.length) {
      throw new NotFoundException('Aucun entrepôt trouvé dans cette ville');
    }
    return entrepots;
  }
}
