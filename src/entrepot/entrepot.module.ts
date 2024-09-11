import { Module } from '@nestjs/common';
import { EntrepotController } from './entrepot.controller';
import { EntrepotService } from './entrepot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrepot } from './entrepot.entity';
import { CityModule } from 'src/city/city.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Entrepot]), CityModule, UserModule],
  controllers: [EntrepotController],
  providers: [EntrepotService],
  exports: [TypeOrmModule],
})
export class EntrepotModule {}
