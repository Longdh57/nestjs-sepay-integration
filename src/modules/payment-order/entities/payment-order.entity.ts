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
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'order_code', type: 'varchar', length: 64, unique: true })
  orderCode: string;

  // Reserved for future payment gateway integration (e.g. Sepay)
  @Column({ name: 'provider', type: 'varchar', length: 32, nullable: true, default: null })
  provider: string | null;

  // Provider-assigned order ID from the payment gateway
  @Column({ name: 'provider_order_id', type: 'varchar', length: 128, nullable: true, default: null })
  providerOrderId: string | null;

  @Column({ name: 'amount', type: 'decimal', precision: 15, scale: 2 })
  amount: string;

  @Column({ name: 'currency', type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentOrderStatus,
    default: PaymentOrderStatus.CREATED,
  })
  status: PaymentOrderStatus;

  @Column({ name: 'customer_id', type: 'varchar', length: 64, nullable: true, default: null })
  customerId: string | null;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true, default: null })
  description: string | null;

  @Column({ name: 'metadata', type: 'json', nullable: true, default: null })
  metadata: Record<string, unknown> | null;

  @Column({ name: 'paid_at', type: 'datetime', nullable: true, default: null })
  paidAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
