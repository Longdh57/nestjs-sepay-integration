import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentOrder } from './entities/payment-order.entity';
import { PaymentOrderController } from './payment-order.controller';
import { PaymentOrderService } from './payment-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentOrder])],
  controllers: [PaymentOrderController],
  providers: [PaymentOrderService],
  // Export service so future gateway modules (e.g. SepayModule) can inject it
  exports: [PaymentOrderService],
})
export class PaymentOrderModule {}
