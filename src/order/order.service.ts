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
import { OrderStatus } from './oderStatus';
import { Entrepot } from 'src/entrepot/entrepot.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private storeService: StoreService,
    private cityService: CityService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Entrepot)
    private entrepotRepository: Repository<Entrepot>,
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
      .leftJoinAndSelect('order.destination','destination')
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

  async assignEntrepotToOrder(
    orderId: number,
    entrepotId: number,
    delivererId: number,
  ): Promise<Order> {
    // Récupérer la commande
    const order = await this.orderRepository.findOne({
      where: { id: orderId, status: OrderStatus.PENDING },
    });
    if (!order) {
      throw new NotFoundException(
        'Order not found or not available for delivery',
      );
    }

    // Récupérer l'entrepôt
    const entrepot = await this.entrepotRepository.findOneBy({
      id: entrepotId,
    });
    if (!entrepot) {
      throw new NotFoundException('Entrepot not found');
    }
    const deliverer = await this.userRepository.findOne({
      where: { id: delivererId },
    });
    // Mettre à jour l'ordre avec l'entrepôt
    order.entrepot = entrepot;
    order.status = OrderStatus.SHIPPED; // Mettre à jour le statut
    order.pickedBy = deliverer; // Optionnel: affecter le livreur

    // Sauvegarder l'ordre mis à jour
    return this.orderRepository.save(order);
  }

  // async getMyOrdersInEntrepot(entrepotId: number) {
  //   const orders = this.orderRepository
  //     .createQueryBuilder('order')
  //     .leftJoin('order.entrepot', 'entrepot')
  //     .leftJoinAndSelect('order.pickedBy', 'pickedBy')
  //     .leftJoinAndSelect('order.destination', 'destination')
  //     .where('entrepot.id = :entrepotId', { entrepotId });

  //   return orders.getMany();
  // }
  async getMyOrdersInEntrepot(entrepotId: number) {
    const orders = this.orderRepository
      .createQueryBuilder('order')
      .select([
        'order.id', // Sélectionne l'ID de la commande (ou d'autres colonnes nécessaires)
        'order.weight',
        'order.price',
        'order.status',
        'pickedBy.lastName', // Sélectionne uniquement le nom de famille du livreur
        'pickedBy.firstName', // Sélectionne uniquement le nom de famille du livreur
        'destination.name' // Sélectionne le nom de la destination (ville)
      ])
      .leftJoin('order.entrepot', 'entrepot')
      .leftJoin('order.pickedBy', 'pickedBy') // Jointure pour l'attribut pickedBy
      .leftJoin('order.destination', 'destination') // Jointure pour l'attribut destination
      .where('entrepot.id = :entrepotId', { entrepotId });
  
    return orders.getMany();
  }
  
}
