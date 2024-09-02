import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { OrderStatus } from '../oderStatus';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'The weight must be at least 0 kg' })
  @Max(100, { message: 'The weight cannot exceed 100 kg' })
  weight: number;

  @IsNumber()
  @IsOptional()
  price?: number;
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
