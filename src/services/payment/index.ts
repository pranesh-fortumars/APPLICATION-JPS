import { PaymentProvider } from './PaymentProvider';
import { MockPaymentProvider } from './MockPaymentProvider';
import { RazorpayProvider } from './RazorpayProvider';

let paymentProviderInstance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (paymentProviderInstance) {
    return paymentProviderInstance;
  }

  const mode = process.env.EXTERNAL_SERVICES_MODE || 'mock';

  if (mode === 'live') {
    paymentProviderInstance = new RazorpayProvider();
  } else {
    paymentProviderInstance = new MockPaymentProvider();
  }

  return paymentProviderInstance;
}
