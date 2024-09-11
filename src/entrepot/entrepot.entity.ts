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
export class Entrepot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  capacity: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.entropots)
  user: User;

  @ManyToOne(() => City, (city) => city.entrepots)
  city: City;

  @OneToMany(() => Order, (order) => order.entrepot)
  orders:Order[];
}
