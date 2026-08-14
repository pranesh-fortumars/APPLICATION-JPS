import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/payment/webhook/route';
import { adminDb } from '@/lib/firebase/admin';

vi.mock('@/services/payment', () => ({
  getPaymentProvider: () => ({
    processWebhook: vi.fn((payload, sig) => {
      if (sig === 'invalid_signature') throw new Error('Invalid signature');
      return { success: true, event: 'payment.captured', orderId: 'pay_123', paymentId: 'txn_123' };
    })
  })
}));

describe('Payment Webhook API (/api/payment/webhook)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid signatures', async () => {
    const req = new Request('http://localhost/api/payment/webhook', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': 'invalid_signature'
      },
      body: JSON.stringify({ event: 'payment.captured' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid signature');
  });

  it('ignores duplicate webhooks (Idempotency check)', async () => {
    const fakeQuery = {
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({
        empty: false,
        docs: [{
          ref: { update: vi.fn() },
          data: () => ({ status: 'PAID' }) // ALREADY PAID
        }]
      })
    };
    
    (adminDb.collection as any).mockReturnValue(fakeQuery);

    const req = new Request('http://localhost/api/payment/webhook', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': 'valid_signature'
      },
      body: JSON.stringify({ event: 'payment.captured' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    // It should safely acknowledge without updating inventory again
    expect(data.note).toBe('Already processed');
  });
});
