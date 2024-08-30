import { Entrepot } from 'src/entrepot/entrepot.entity';
import { Store } from 'src/store/store.entity';
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

}
