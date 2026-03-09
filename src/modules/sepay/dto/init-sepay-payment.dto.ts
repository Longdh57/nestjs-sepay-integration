import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export type SepayPaymentMethod = 'BANK_TRANSFER' | 'NAPAS_BANK_TRANSFER';

export class InitSepayPaymentDto {
  @ApiPropertyOptional({
    enum: ['BANK_TRANSFER', 'NAPAS_BANK_TRANSFER'],
    default: 'BANK_TRANSFER',
    description: 'Payment method. Defaults to BANK_TRANSFER (VietQR).',
  })
  @IsOptional()
  @IsEnum(['BANK_TRANSFER', 'NAPAS_BANK_TRANSFER'])
  paymentMethod?: SepayPaymentMethod;
}
