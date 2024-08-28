import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { OrderStatus } from '../oderStatus';

export class CreateOrderDto {
  @IsNumber()
  weight: number;

  @IsNumber()
  price: number;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
