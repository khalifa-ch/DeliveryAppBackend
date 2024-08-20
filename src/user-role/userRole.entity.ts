import { Role } from 'src/role/role.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({default:"active"})
  status: string;
  @CreateDateColumn()
  assignedAt: Date;
  @ManyToOne(() => User, (user) => user.userRoles)
  user: User;
  @ManyToOne(() => Role, (role) => role.userRoles)
  role: Role;
}
