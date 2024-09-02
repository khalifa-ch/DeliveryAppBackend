import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEntrepotDto {
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class UpdateEntrepotDto {
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  address?: string;
}
