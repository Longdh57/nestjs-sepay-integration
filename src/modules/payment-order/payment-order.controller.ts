import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { QueryPaymentOrderDto } from './dto/query-payment-order.dto';
import { PaymentOrderService } from './payment-order.service';

@Controller('payment-orders')
export class PaymentOrderController {
  constructor(private readonly paymentOrderService: PaymentOrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePaymentOrderDto) {
    return this.paymentOrderService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryPaymentOrderDto) {
    return this.paymentOrderService.findAll(query);
  }
}
