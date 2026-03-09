import { registerAs } from '@nestjs/config';

export default registerAs('sepay', () => ({
  env: (process.env.SEPAY_ENV ?? 'sandbox') as 'sandbox' | 'production',
  merchantId: process.env.SEPAY_MERCHANT_ID ?? '',
  secretKey: process.env.SEPAY_SECRET_KEY ?? '',
  appPublicBaseUrl: process.env.APP_PUBLIC_BASE_URL ?? 'http://localhost:3000',
  webhookApiKey: process.env.SEPAY_WEBHOOK_API_KEY ?? '',
}));
