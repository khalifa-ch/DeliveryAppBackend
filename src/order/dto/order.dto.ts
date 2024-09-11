import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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

  @IsNotEmpty()
  @IsString()
  clientPhoneNumber: string;
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
