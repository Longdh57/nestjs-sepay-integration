import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentOrderStatus } from '../enums/payment-order-status.enum';

@Entity('payment_orders')
@Index('idx_payment_orders_status', ['status'])
@Index('idx_payment_orders_customer_id', ['customerId'])
@Index('idx_payment_orders_created_at', ['createdAt'])
export class PaymentOrder {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty({ example: 'PO_20260309_001' })
  @Column({ name: 'order_code', type: 'varchar', length: 64, unique: true })
  orderCode: string;

  @ApiPropertyOptional({ example: null, nullable: true, description: 'Payment gateway provider (e.g. sepay)' })
  @Column({ name: 'provider', type: 'varchar', length: 32, nullable: true, default: null })
  provider: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @Column({ name: 'provider_order_id', type: 'varchar', length: 128, nullable: true, default: null })
  providerOrderId: string | null;

  @ApiProperty({ example: '100000.00', description: 'Decimal returned as string' })
  @Column({ name: 'amount', type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @ApiProperty({ example: 'VND' })
  @Column({ name: 'currency', type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @ApiProperty({ enum: PaymentOrderStatus, example: PaymentOrderStatus.CREATED })
  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentOrderStatus,
    default: PaymentOrderStatus.CREATED,
  })
  status: PaymentOrderStatus;

  @ApiPropertyOptional({ example: 'CUS_001', nullable: true })
  @Column({ name: 'customer_id', type: 'varchar', length: 64, nullable: true, default: null })
  customerId: string | null;

  @ApiPropertyOptional({ example: 'Test payment order', nullable: true })
  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true, default: null })
  description: string | null;

  @ApiPropertyOptional({ example: null, nullable: true, type: 'object' })
  @Column({ name: 'metadata', type: 'json', nullable: true, default: null })
  metadata: Record<string, unknown> | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  @Column({ name: 'paid_at', type: 'datetime', nullable: true, default: null })
  paidAt: Date | null;

  @ApiProperty({ example: '2026-03-09T08:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-09T08:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
