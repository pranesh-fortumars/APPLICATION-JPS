import { PaymentProvider, PaymentOrder } from './PaymentProvider';
import crypto from 'crypto';

export class RazorpayProvider implements PaymentProvider {
  private keyId: string;
  private keySecret: string;

  constructor() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Payment service is not configured. RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required when EXTERNAL_SERVICES_MODE=live");
    }
    this.keyId = process.env.RAZORPAY_KEY_ID;
    this.keySecret = process.env.RAZORPAY_KEY_SECRET;
  }

  async createOrder(amount: number, receiptId: string): Promise<PaymentOrder> {
    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects amount in paise (smallest currency unit)
        currency: 'INR',
        receipt: receiptId
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Razorpay Error: ${err.error?.description || response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      amount: data.amount / 100, // convert back to rupees
      currency: data.currency,
      status: data.status
    };
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(body.toString())
      .digest('hex');
      
    return expectedSignature === signature;
  }

  async processWebhook(payload: any, signature: string): Promise<{ success: boolean; event?: string; data?: any }> {
    // 1. Verify webhook signature
    // Note: Razorpay webhook secret is usually configured separately from keySecret. 
    // Assuming WEBHOOK_SECRET is set, else using keySecret for demonstration.
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || this.keySecret;
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error("Invalid webhook signature");
    }

    return {
      success: true,
      event: payload.event,
      data: payload.payload
    };
  }

  async refundPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string }> {
    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: amount ? JSON.stringify({ amount: Math.round(amount * 100) }) : undefined
    });

    if (!response.ok) {
      throw new Error(`Refund failed`);
    }

    const data = await response.json();
    return {
      success: true,
      refundId: data.id
    };
  }
}
