import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SepayIpnOrderDto {
  @ApiProperty({ example: 'e2c195be-c721-47eb-b323-99ab24e52d85' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'NQD-68DA43D73C1A5' })
  @IsString()
  order_id: string;

  @ApiProperty({ example: 'CAPTURED' })
  @IsString()
  order_status: string;

  @ApiProperty({ example: 'VND' })
  @IsString()
  order_currency: string;

  @ApiProperty({ example: '100000.00' })
  @IsString()
  order_amount: string;

  @ApiProperty({ example: 'INV-1759134677' })
  @IsString()
  order_invoice_number: string;

  @ApiPropertyOptional({ example: [] })
  @IsOptional()
  @IsArray()
  custom_data?: any[];

  @ApiPropertyOptional({ example: 'Mozilla/5.0' })
  @IsOptional()
  @IsString()
  user_agent?: string | null;

  @ApiPropertyOptional({ example: '14.186.39.212' })
  @IsOptional()
  @IsString()
  ip_address?: string | null;

  @ApiPropertyOptional({ example: 'Test payment' })
  @IsOptional()
  @IsString()
  order_description?: string | null;
}

export class SepayIpnTransactionDto {
  @ApiProperty({ example: '384c66dd-41e6-4316-a544-b4141682595c' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'BANK_TRANSFER' })
  @IsString()
  payment_method: string;

  @ApiProperty({ example: '68da43da2d9de' })
  @IsString()
  transaction_id: string;

  @ApiProperty({ example: 'PAYMENT' })
  @IsString()
  transaction_type: string;

  @ApiProperty({ example: '2025-09-29 15:31:22' })
  @IsString()
  transaction_date: string;

  @ApiProperty({ example: 'APPROVED' })
  @IsString()
  transaction_status: string;

  @ApiProperty({ example: '100000' })
  @IsString()
  transaction_amount: string;

  @ApiProperty({ example: 'VND' })
  @IsString()
  transaction_currency: string;

  @ApiPropertyOptional({ example: 'AUTHENTICATION_SUCCESSFUL' })
  @IsOptional()
  @IsString()
  authentication_status?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  card_number?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  card_holder_name?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  card_expiry?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  card_funding_method?: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  card_brand?: string | null;
}

export class SepayIpnPayloadDto {
  @ApiProperty({ example: 1759134682 })
  @IsInt()
  timestamp: number;

  @ApiProperty({ example: 'ORDER_PAID' })
  @IsString()
  @IsNotEmpty()
  notification_type: string;

  @ApiProperty({ type: () => SepayIpnOrderDto })
  @ValidateNested()
  @Type(() => SepayIpnOrderDto)
  order: SepayIpnOrderDto;

  @ApiProperty({ type: () => SepayIpnTransactionDto })
  @ValidateNested()
  @Type(() => SepayIpnTransactionDto)
  transaction: SepayIpnTransactionDto;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  customer?: any | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  agreement?: any | null;
}
