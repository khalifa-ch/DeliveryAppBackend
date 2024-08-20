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
  @OneToMany(() => UserRole, (userRole) => userRole.user, { onDelete: "CASCADE" })
  userRoles: UserRole[];
}
