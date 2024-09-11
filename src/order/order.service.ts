import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order.dto';
import { StoreService } from 'src/store/store.service';
import { CityService } from 'src/city/city.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private storeService: StoreService,
    private cityService: CityService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    storeId: string,
    cityId: string,
  ): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    if (!storeId) {
      throw new BadRequestException('plz provide a storeId');
    }
    if (!cityId) {
      throw new BadRequestException('plz provide a cityId');
    }

    const store = await this.storeService.getById(parseInt(storeId));
    const city = await this.cityService.findOne(parseInt(cityId));

    const weight = createOrderDto.weight;
    let tarifKilo;
    if (weight <= 10) {
      tarifKilo = 1;
    } else if (weight > 10 && weight <= 20) {
      tarifKilo = 1.5;
    } else {
      tarifKilo = 2;
    }
    order.price = tarifKilo * weight;
    order.store = store;
    order.destination = city;
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }
    return order;
  }
  async update(id: number, attrs: Partial<Order>) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`order with ID ${id} not found`);
    }
    Object.assign(order, attrs);
    return this.orderRepository.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`order with ID ${id} not found`);
    }
    return this.orderRepository.remove(order);
  }
  async getMyOrders(userId: number, storeId?: number) {
    const orders = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.store', 'store')
      .where('store.userId = :userId', { userId });

    if (storeId) {
      orders.andWhere('store.id = :storeId', { storeId });
    }

    return orders.getMany();
  }

  async getOrdersReadyForPickupByDeliverer(delivererId: number) {
    const deliverer = await this.userRepository.findOne({
      where: { id: delivererId },
      relations: ['city'],
    });

    if (!deliverer) {
      throw new Error('Deliverer not found');
    }

    // Fetch orders with pending status from stores in the same city as the deliverer
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoin('store.city', 'city')
      .where('order.status = :status', { status: 'Pending' })
      .andWhere('city.id = :cityId', { cityId: deliverer.city.id })
      .getMany();

    return orders;
  }
}
