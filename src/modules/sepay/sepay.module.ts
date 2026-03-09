import { Module } from '@nestjs/common';
import { PaymentOrderModule } from '../payment-order/payment-order.module';
import { SepayClientProvider } from './sepay-client.provider';
import { SepayController } from './sepay.controller';
import { SepayIpnController } from './sepay-ipn.controller';
import { SepayService } from './sepay.service';

@Module({
  imports: [
    // Import PaymentOrderModule to get access to PaymentOrderService
    PaymentOrderModule,
  ],
  controllers: [SepayController, SepayIpnController],
  providers: [SepayService, SepayClientProvider],
})
export class SepayModule {}
