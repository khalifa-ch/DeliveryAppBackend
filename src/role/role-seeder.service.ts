import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from './role.enum';

@Injectable()
export class RoleSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async onApplicationBootstrap() {
    const roles = [RoleEnum.Admin, RoleEnum.StoreOwner, RoleEnum.Deliverer];

    for (const roleName of roles) {
      const roleExists = await this.roleRepository.findOneBy({
        name: roleName,
      });
      if (!roleExists) {
        const role = new Role();
        role.name = roleName;
        await this.roleRepository.save(role);
      }
    }
  }
}
