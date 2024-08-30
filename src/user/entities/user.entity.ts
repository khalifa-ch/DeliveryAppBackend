import { Car } from 'src/car/car.entity';
import { Entrepot } from 'src/entrepot/entrepot.entity';
import { Store } from 'src/store/store.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
