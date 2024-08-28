import { Module } from '@nestjs/common';
import { EntrepotController } from './entrepot.controller';
import { EntrepotService } from './entrepot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrepot } from './entrepot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrepot])],
  controllers: [EntrepotController],
  providers: [EntrepotService],
})
export class EntrepotModule {}
