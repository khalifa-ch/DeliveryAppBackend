import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from './role.enum';
import { UserRole } from 'src/user-role/userRole.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type:'enum',
    enum:RoleEnum
  })
  name: RoleEnum;
  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

}
