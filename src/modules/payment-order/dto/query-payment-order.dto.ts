import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentOrderStatus } from '../enums/payment-order-status.enum';

export class QueryPaymentOrderDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ enum: PaymentOrderStatus, example: PaymentOrderStatus.CREATED })
  @IsOptional()
  @IsEnum(PaymentOrderStatus)
  status?: PaymentOrderStatus;

  @ApiPropertyOptional({ example: 'PO_2026', description: 'Partial match' })
  @IsOptional()
  @IsString()
  orderCode?: string;

  @ApiPropertyOptional({ example: 'CUS_001', description: 'Exact match' })
  @IsOptional()
  @IsString()
  customerId?: string;
}
