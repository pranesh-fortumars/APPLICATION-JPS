import { PaymentProvider, PaymentOrder } from './PaymentProvider';

export class MockPaymentProvider implements PaymentProvider {
  async createOrder(amount: number, receiptId: string): Promise<PaymentOrder> {
    console.log(`[MOCK PAYMENT] Creating order for receipt ${receiptId} of amount ${amount}`);
    
    // Simulate Razorpay generating an order ID
    return {
      id: `mock_order_${Math.floor(Math.random() * 1000000)}`,
      amount,
      currency: 'INR',
      status: 'created'
    };
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    console.log(`[MOCK PAYMENT] Verifying signature for ${orderId}`);
    
    // In Mock mode, we accept signatures starting with "mock_sig_" or allow a special bypass
    if (signature === 'mock_success_signature') return true;
    if (signature === 'mock_failure_signature') return false;
    
    return true; // Default allow in dev mode for UI flow
  }

  async processWebhook(payload: any, signature: string): Promise<{ success: boolean; event?: string; data?: any }> {
    console.log(`[MOCK PAYMENT] Processing webhook`, payload.event);
    
    // Simulate webhook handling logic
    return {
      success: true,
      event: payload.event || 'payment.captured',
      data: payload.payload?.payment?.entity
    };
  }

  async refundPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string }> {
    console.log(`[MOCK PAYMENT] Refunding payment ${paymentId}`);
    return {
      success: true,
      refundId: `mock_refund_${Math.floor(Math.random() * 1000000)}`
    };
  }
}
