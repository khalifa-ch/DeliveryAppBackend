import { Car } from 'src/car/car.entity';
import { City } from 'src/city/city.entity';
import { Entrepot } from 'src/entrepot/entrepot.entity';
import { Order } from 'src/order/order.entity';
import { Store } from 'src/store/store.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @OneToMany(() => UserRole, (userRole) => userRole.user, {
    onDelete: 'CASCADE',
  })
  userRoles: UserRole[];

  @OneToMany(() => Entrepot, (entrepot) => entrepot.user)
  entropots: Entrepot[];

  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];

  @ManyToOne(() => City, (city) => city.users)
  city: City;

  @OneToMany(() => Order, (order) => order.pickedBy)
  pickedOrders: Order[];

  @OneToMany(() => Order, (order) => order.deliveredBy)
  deliveredOrders: Order[];
}
