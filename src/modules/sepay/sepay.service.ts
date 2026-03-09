import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SePayPgClient } from 'sepay-pg-node';
import { SingleResponseDto } from '../../common/dto/single-response.dto';
import { PaymentOrderService } from '../payment-order/payment-order.service';
import { PaymentOrderStatus } from '../payment-order/enums/payment-order-status.enum';
import { SEPAY_CLIENT } from './sepay-client.provider';
import { InitSepayPaymentDto } from './dto/init-sepay-payment.dto';
import { SepayIpnPayloadDto } from './dto/sepay-ipn-payload.dto';
import { IpnResult } from './interfaces/ipn-result.interface';

// Statuses that block a new payment initiation
const NON_PAYABLE_STATUSES = [PaymentOrderStatus.PAID, PaymentOrderStatus.CANCELED];

@Injectable()
export class SepayService {
  private readonly logger = new Logger(SepayService.name);

  constructor(
    @Inject(SEPAY_CLIENT)
    private readonly sepayClient: SePayPgClient,
    private readonly paymentOrderService: PaymentOrderService,
    private readonly configService: ConfigService,
  ) {}

  async initPayment(orderCode: string, dto: InitSepayPaymentDto) {
    const order = await this.paymentOrderService.findByOrderCode(orderCode);

    if (NON_PAYABLE_STATUSES.includes(order.status)) {
      throw new ConflictException(
        `Payment order is already ${order.status} and cannot be re-initiated`,
      );
    }

    const baseUrl = this.configService.get<string>('sepay.appPublicBaseUrl');

    const formFields = this.sepayClient.checkout.initOneTimePaymentFields({
      operation: 'PURCHASE',
      payment_method: dto.paymentMethod ?? 'BANK_TRANSFER',
      order_invoice_number: order.orderCode,
      order_amount: parseFloat(order.amount),
      currency: order.currency,
      order_description:
        order.description ?? `Payment for order ${order.orderCode}`,
      customer_id: order.customerId ?? undefined,
      success_url: `${baseUrl}/payments/sepay/success?orderCode=${order.orderCode}&amount=${order.amount}&status=PAID`,
      error_url: `${baseUrl}/payments/sepay/failed?orderCode=${order.orderCode}&amount=${order.amount}&status=FAILED`,
      cancel_url: `${baseUrl}/payments/sepay/canceled?orderCode=${order.orderCode}&amount=${order.amount}&status=CANCELED`,
      custom_data: JSON.stringify({
        internalOrderId: order.id,
        orderCode: order.orderCode,
      }),
    });

    const checkoutUrl = this.sepayClient.checkout.initCheckoutUrl();

    // Transition CREATED → PENDING on first init
    if (order.status === PaymentOrderStatus.CREATED) {
      await this.paymentOrderService.updateStatus(
        order.id,
        PaymentOrderStatus.PENDING,
      );
    }

    return new SingleResponseDto({
      orderCode: order.orderCode,
      checkoutUrl,
      formFields,
    });
  }

  async processIpn(payload: SepayIpnPayloadDto): Promise<IpnResult> {
    const invoiceNumber = payload.order.order_invoice_number;
    const transactionId = payload.transaction.transaction_id;

    // Only handle ORDER_PAID notifications
    if (payload.notification_type !== 'ORDER_PAID') {
      this.logger.log(
        `Skipping IPN transaction="${transactionId}": notification_type="${payload.notification_type}"`,
      );
      return { success: true };
    }

    // Find the order by invoice number (order_invoice_number maps to orderCode)
    let order;
    try {
      order = await this.paymentOrderService.findByOrderCode(invoiceNumber);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(
          `Skipping IPN transaction="${transactionId}": order with invoice "${invoiceNumber}" not found`,
        );
        return { success: true };
      }
      throw error;
    }

    // Skip if already paid (idempotent)
    if (order.status === PaymentOrderStatus.PAID) {
      this.logger.log(
        `Skipping IPN transaction="${transactionId}": order "${invoiceNumber}" already PAID`,
      );
      return { success: true };
    }

    // Skip terminal states
    if (
      order.status === PaymentOrderStatus.FAILED ||
      order.status === PaymentOrderStatus.CANCELED
    ) {
      this.logger.warn(
        `Skipping IPN transaction="${transactionId}": order "${invoiceNumber}" is ${order.status}`,
      );
      return { success: true };
    }

    // Parse transaction date safely
    const paidAt = payload.transaction.transaction_date
      ? new Date(payload.transaction.transaction_date)
      : new Date();
    const safePaidAt = isNaN(paidAt.getTime()) ? new Date() : paidAt;

    const updated = await this.paymentOrderService.markAsPaid(order.id, {
      provider: 'sepay',
      providerOrderId: payload.transaction.id,
      paidAt: safePaidAt,
    });

    if (updated) {
      this.logger.log(
        `Order "${invoiceNumber}" marked as PAID via IPN transaction="${transactionId}"`,
      );
    } else {
      this.logger.warn(
        `Order "${invoiceNumber}" was not updated (concurrent transition) for IPN transaction="${transactionId}"`,
      );
    }

    return { success: true };
  }

  async getPayFormHtml(orderCode: string): Promise<string> {
    // Reuse initPayment logic to get fields, then render a self-submitting HTML form
    const result = await this.initPayment(orderCode, {
      paymentMethod: 'BANK_TRANSFER',
    });

    const { checkoutUrl, formFields } = result.data;

    const hiddenInputs = Object.entries(formFields)
      .map(
        ([key, value]) =>
          `  <input type="hidden" name="${key}" value="${String(value ?? '')}">`,
      )
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redirecting to SePay...</title>
</head>
<body>
  <p>Redirecting to SePay payment gateway. Please wait...</p>
  <form id="sepay-form" method="POST" action="${checkoutUrl}">
${hiddenInputs}
  </form>
  <script>document.getElementById('sepay-form').submit();</script>
</body>
</html>`;
  }
}
