import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { InitSepayPaymentDto } from './dto/init-sepay-payment.dto';
import { SepayService } from './sepay.service';

@ApiTags('payment-orders / sepay')
@Controller('payment-orders')
export class SepayController {
  constructor(private readonly sepayService: SepayService) {}

  @Post(':orderCode/sepay/init')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Initialize SePay payment for an existing payment order',
    description:
      'Generates SePay checkout fields and URL. Status transitions from CREATED → PENDING on first call.',
  })
  @ApiParam({ name: 'orderCode', example: 'PO_20260309_001' })
  @ApiOkResponse({ description: 'Checkout fields and URL returned successfully' })
  @ApiNotFoundResponse({ description: 'Payment order not found' })
  @ApiConflictResponse({ description: 'Order is already PAID or CANCELED' })
  initPayment(
    @Param('orderCode') orderCode: string,
    @Body() dto: InitSepayPaymentDto,
  ) {
    return this.sepayService.initPayment(orderCode, dto);
  }

  @Get(':orderCode/sepay/pay')
  @Header('Content-Type', 'text/html')
  @ApiOperation({
    summary: '[DEBUG] Auto-submit HTML form to SePay — browser testing only',
    description:
      'Returns a minimal HTML page that auto-POSTs to the SePay checkout. Use this in a browser to test the full checkout flow without a frontend.',
  })
  @ApiParam({ name: 'orderCode', example: 'PO_20260309_001' })
  getPayForm(@Param('orderCode') orderCode: string) {
    return this.sepayService.getPayFormHtml(orderCode);
  }
}
