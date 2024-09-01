import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { CityModule } from 'src/city/city.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), CityModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
