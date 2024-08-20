import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './userRole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  controllers: [UserRoleController],
  providers: [UserRoleService],
  exports: [TypeOrmModule],
})
export class UserRoleModule {}
