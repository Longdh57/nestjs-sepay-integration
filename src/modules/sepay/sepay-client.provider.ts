import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SePayPgClient } from 'sepay-pg-node';

export const SEPAY_CLIENT = 'SEPAY_CLIENT';

export const SepayClientProvider: Provider = {
  provide: SEPAY_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): SePayPgClient => {
    const env = configService.get<'sandbox' | 'production'>('sepay.env');
    const merchant_id = configService.get<string>('sepay.merchantId');
    const secret_key = configService.get<string>('sepay.secretKey');

    if (!merchant_id || !secret_key) {
      throw new Error(
        'SePay configuration is incomplete. SEPAY_MERCHANT_ID and SEPAY_SECRET_KEY must be set.',
      );
    }

    return new SePayPgClient({ env, merchant_id, secret_key });
  },
};
