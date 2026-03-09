import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { QueryPaymentOrderDto } from './dto/query-payment-order.dto';
import { PaymentOrderService } from './payment-order.service';

@ApiTags('payment-orders')
@Controller('payment-orders')
export class PaymentOrderController {
  constructor(private readonly paymentOrderService: PaymentOrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a payment order' })
  @ApiCreatedResponse({ description: 'Payment order created successfully' })
  @ApiConflictResponse({ description: 'orderCode already exists' })
  create(@Body() dto: CreatePaymentOrderDto) {
    return this.paymentOrderService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List payment orders with pagination and filters' })
  @ApiOkResponse({ description: 'Paginated list of payment orders' })
  findAll(@Query() query: QueryPaymentOrderDto) {
    return this.paymentOrderService.findAll(query);
  }
}
