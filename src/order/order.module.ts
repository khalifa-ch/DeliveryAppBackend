import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { StoreModule } from 'src/store/store.module';
import { CityModule } from 'src/city/city.module';
import { UserModule } from 'src/user/user.module';
import { EntrepotModule } from 'src/entrepot/entrepot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    StoreModule,
    CityModule,
    UserModule,
    EntrepotModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
