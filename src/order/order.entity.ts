import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OrderStatus } from './oderStatus';
import { Store } from 'src/store/store.entity';
import { City } from 'src/city/city.entity';
import { User } from 'src/user/entities/user.entity';
import { Entrepot } from 'src/entrepot/entrepot.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  weight: number;

  @Column('float')
  price: number;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING, // Valeur par défaut
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Store, (store) => store.orders)
  store: Store;

  @ManyToOne(() => City, (city) => city.orders)
  destination: City;

  @Column()
  clientPhoneNumber: string;

  @ManyToOne(() => User, (user) => user.pickedOrders)
  pickedBy: User;

  @ManyToOne(() => User, (user) => user.deliveredOrders)
  deliveredBy: User;

  @ManyToOne(() => Entrepot, (entrepot) => entrepot.orders)
  entrepot: Entrepot;
}
