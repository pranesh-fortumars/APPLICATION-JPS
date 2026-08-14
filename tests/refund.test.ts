import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/orders/refund/route';
import { adminDb } from '@/lib/firebase/admin';

describe('Refund API (/api/orders/refund)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects an order that is already refunded (Duplicate Refund Prevention)', async () => {
    const fakeTransaction = {
      get: vi.fn((ref) => {
        if (ref.id === 'ORDER-1') {
          return {
            exists: true,
            data: () => ({ status: 'REFUNDED', paymentId: 'pay_123', totalPrice: 2000 })
          };
        }
        return { exists: false };
      }),
    };
    
    (adminDb.runTransaction as any).mockImplementation(async (cb: any) => await cb(fakeTransaction));

    const req = new Request('http://localhost/api/orders/refund', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'ORDER-1' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Order is already refunded');
  });

  it('restores inventory variant stock upon successful refund', async () => {
    const fakeTransaction = {
      get: vi.fn((ref) => {
        if (ref.id === 'ORDER-2') {
          return {
            exists: true,
            ref,
            data: () => ({ 
              status: 'PAID', 
              paymentId: 'pay_123', 
              totalPrice: 2000,
              items: [{ selectedVariant: { sku: 'SKU-ABC' }, quantity: 3 }] 
            })
          };
        }
        if (ref.id === 'SKU-ABC') {
          return {
            exists: true,
            ref,
            data: () => ({ stock: 5 })
          };
        }
        return { exists: false };
      }),
      update: vi.fn(),
      set: vi.fn()
    };
    
    (adminDb.runTransaction as any).mockImplementation(async (cb: any) => await cb(fakeTransaction));

    const req = new Request('http://localhost/api/orders/refund', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'ORDER-2' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(200);
    
    // Check if variant stock was updated correctly (5 + 3 = 8)
    const updateCalls = fakeTransaction.update.mock.calls;
    const variantUpdateCall = updateCalls.find((call: any) => call[1].stock === 8);
    expect(variantUpdateCall).toBeDefined();

    // Check if order status was updated
    const orderUpdateCall = updateCalls.find((call: any) => call[1].status === 'REFUNDED');
    expect(orderUpdateCall).toBeDefined();
  });
});
