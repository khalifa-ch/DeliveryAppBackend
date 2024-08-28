import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/role/role.entity';
import { UserRole } from 'src/user-role/userRole.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { RoleEnum } from 'src/role/role.enum';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { promises } from 'fs';
const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async createStoreOwner(storeOwner: CreateUserDto): Promise<User> {
    const storeOwnerExist = await this.findByEmail(storeOwner.email);
    if (storeOwnerExist) {
      throw new BadRequestException('email in use');
    }

    //hashing the  user password
    //generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scrypt(storeOwner.password, salt, 32)) as Buffer;
    //Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    storeOwner.password = result;

    const newStoreOnwer = this.userRepository.create(storeOwner);

    const savedStoreOwner = await this.userRepository.save(newStoreOnwer);

    const storeOwnerRole = await this.roleRepository.findOne({
      where: { name: RoleEnum.StoreOwner },
    });
    const userRole = this.userRoleRepository.create({
      user: savedStoreOwner,
      role: storeOwnerRole,
    });

    await this.userRoleRepository.save(userRole);

    return savedStoreOwner;
  }

  async createDeliver(deliver: CreateUserDto): Promise<User> {
    const deliverExist = await this.findByEmail(deliver.email);
    if (deliverExist) {
      throw new BadRequestException('email in use');
    }

    //hashing the  user password
    //generate a salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scrypt(deliver.password, salt, 32)) as Buffer;
    //Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    deliver.password = result;

    const newDeliver = this.userRepository.create(deliver);

    const savedDeliver = await this.userRepository.save(newDeliver);

    const deliverRole = await this.roleRepository.findOne({
      where: { name: RoleEnum.Deliverer },
    });
    const userRole = this.userRoleRepository.create({
      user: savedDeliver,
      role: deliverRole,
    });

    await this.userRoleRepository.save(userRole);

    return savedDeliver;
  }

  async getById(id: number): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
  }

  async getAll() {
    return await this.userRepository.find({ relations: ['userRoles.role'] });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }   

  async update(id: number, attrs: Partial<User>) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('could not found baby sitter');
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('could not found user');
    }
    await this.userRoleRepository.delete({ user: { id: id } });

    return this.userRepository.remove(user);
  }
  async getDeliverers(): Promise<User[]> {
    const users = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.userRoles', 'userRole')
    .leftJoinAndSelect('userRole.role', 'role')
    .getMany();

  return users.filter(user => user.userRoles.length > 0 && user.userRoles[0].role.name === RoleEnum.Deliverer)
  }
  async getStoreOnwners(): Promise<User[]> {
    const users = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.userRoles', 'userRole')
    .leftJoinAndSelect('userRole.role', 'role')
    .getMany();

  return users.filter(user => user.userRoles.length > 0 && user.userRoles[0].role.name === RoleEnum.StoreOwner)
  }

}
