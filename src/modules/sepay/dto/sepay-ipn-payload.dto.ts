import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SepayIpnPayloadDto {
  @ApiProperty({ example: 99001 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Vietcombank' })
  @IsString()
  gateway: string;

  @ApiProperty({ example: '2026-03-09 15:30:00' })
  @IsString()
  transactionDate: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  accountNumber: string;

  @ApiPropertyOptional({ example: 'IPN_TEST_001', nullable: true })
  @IsOptional()
  @IsString()
  code: string | null;

  @ApiPropertyOptional({ example: 'IPN_TEST_001 thanh toan', nullable: true })
  @IsOptional()
  @IsString()
  content: string | null;

  @ApiProperty({ example: 'in', enum: ['in', 'out'] })
  @IsString()
  transferType: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  transferAmount: number;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  accumulated: number;

  @ApiPropertyOptional({ example: null, nullable: true })
  @IsOptional()
  @IsString()
  subAccount: string | null;

  @ApiPropertyOptional({ example: 'REF001', nullable: true })
  @IsOptional()
  @IsString()
  referenceCode: string | null;

  @ApiPropertyOptional({ example: 'IPN_TEST_001 thanh toan', nullable: true })
  @IsOptional()
  @IsString()
  description: string | null;
}
