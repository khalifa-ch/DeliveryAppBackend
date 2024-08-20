import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Role } from '../role/role.entity'; // Import your Role entity
import { UserRole } from '../user-role/userRole.entity'; // Import your UserRole entity
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { RoleEnum } from 'src/role/role.enum';
const scrypt = promisify(_scrypt);

@Injectable()
export class UserSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async onApplicationBootstrap() {
    const adminUser = await this.userRepository.findOne({
      where: { email: 'admin@admin.com' },
    });
    if (!adminUser) {
      // If the admin user does not exist, create it
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt('admin@admin', salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      const hashedPassword = result;

      const newUser = this.userRepository.create({
        email: 'admin@admin.com',
        password: hashedPassword,
        firstName: 'Khalifa',
        lastName: 'Chelbi',
      });

      const savedUser = await this.userRepository.save(newUser);
      const adminRole = await this.roleRepository.findOne({
        where: { name: RoleEnum.Admin },
      });

      // Create UserRole association
      const userRole = this.userRoleRepository.create({
        user: savedUser,
        role: adminRole,
      });

      await this.userRoleRepository.save(userRole);

      console.log('Admin user seeded');
    } else {
      return null;
    }
  }
}
