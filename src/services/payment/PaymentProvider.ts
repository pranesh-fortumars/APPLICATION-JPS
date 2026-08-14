export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid';
}

export interface PaymentProvider {
  /**
   * Generates an Order ID on the payment gateway securely.
   */
  createOrder(amount: number, receiptId: string): Promise<PaymentOrder>;
  
  /**
   * Verifies the cryptographic signature of a successful payment.
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
  
  /**
   * Processes a webhook event (e.g. payment.authorized)
   */
  processWebhook(payload: any, signature: string): Promise<{ success: boolean; event?: string; data?: any }>;
  
  /**
   * Issues a refund for a given payment.
   */
  refundPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string }>;
}
