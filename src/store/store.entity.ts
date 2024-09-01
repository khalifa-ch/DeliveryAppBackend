import { City } from 'src/city/city.entity';
import { Order } from 'src/order/order.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.stores)
  user: User;

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @ManyToOne(() => City, (city) => city.stores)
  city: City;
}
