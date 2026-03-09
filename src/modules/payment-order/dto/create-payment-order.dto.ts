import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePaymentOrderDto {
  @ApiProperty({ example: 'PO_20260309_001', maxLength: 64 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  orderCode: string;

  @ApiProperty({ example: 100000, description: 'Positive number, max 2 decimal places' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ example: 'VND', maxLength: 10, default: 'VND' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ example: 'CUS_001', maxLength: 64 })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  customerId?: string;

  @ApiPropertyOptional({ example: 'Test payment order', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    example: { source: 'manual-test', note: 'created from api' },
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
