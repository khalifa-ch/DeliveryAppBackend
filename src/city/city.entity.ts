import { Entrepot } from 'src/entrepot/entrepot.entity';
import { Order } from 'src/order/order.entity';
import { Store } from 'src/store/store.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.city)
  stores: Store[];

  @OneToMany(() => Entrepot, (entrepot) => entrepot.city)
  entrepots: Entrepot[];

  @OneToMany(() => User, (user) => user.city)
  users: User[];
  
  @OneToMany(() => Order, (order) => order.destination)
  orders: Order[];
}
