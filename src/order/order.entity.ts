import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from './oderStatus';

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
}
