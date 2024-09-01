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

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private storeService: StoreService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    storeId: string,
  ): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    if (!storeId) {
      throw new BadRequestException('plz provide a storeId');
    }
    const store = await this.storeService.getById(parseInt(storeId));
    order.store = store;
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
}
