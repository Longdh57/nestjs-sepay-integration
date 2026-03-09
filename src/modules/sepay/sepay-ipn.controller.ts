import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SepayIpnPayloadDto } from './dto/sepay-ipn-payload.dto';
import { SepayService } from './sepay.service';

@ApiTags('sepay / ipn')
@Controller('payments/sepay')
export class SepayIpnController {
  constructor(private readonly sepayService: SepayService) {}

  @Post('ipn')
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @ApiOperation({
    summary: 'SePay IPN webhook',
    description: 'Receives payment notifications from SePay.',
  })
  @ApiOkResponse({ description: 'Webhook processed successfully' })
  processIpn(@Body() payload: SepayIpnPayloadDto) {
    return this.sepayService.processIpn(payload);
  }
}
