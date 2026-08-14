import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/checkout/create-order/route';
import { adminDb } from '@/lib/firebase/admin';

describe('Checkout API (/api/checkout/create-order)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects empty carts', async () => {
    const req = new Request('http://localhost/api/checkout/create-order', {
      method: 'POST',
      body: JSON.stringify({ userId: '123', items: [] })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(400);
  });

  it('recalculates prices server-side and applies GST correctly, ignoring client price manipulations', async () => {
    const fakeTransaction = {
      get: vi.fn((ref) => {
        if (ref.id === 'SKU-123') {
          return {
            exists: true,
            data: () => ({ sku: 'SKU-123', price: 1000, stock: 10 })
          };
        }
        if (ref.path.startsWith('orders/')) {
          return {
            exists: true,
            data: () => ({ totalPrice: 2250 }),
          };
        }
        return { exists: false };
      }),
      set: vi.fn(),
      update: vi.fn()
    };
    
    (adminDb.runTransaction as any).mockImplementation(async (cb: any) => await cb(fakeTransaction));

    const req = new Request('http://localhost/api/checkout/create-order', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'u1',
        items: [
          {
            selectedVariant: { sku: 'SKU-123' },
            quantity: 2,
            price: 1 // HACKER ATTEMPTED PRICE
          }
        ]
      })
    });
    
    const response = await POST(req as any);
    
    // Subtotal should be 2000 (2 * 1000). 
    // GST = 2000 * 0.05 = 100.
    // Shipping = 0 (since > 2000? No, wait, 2000 > 2000 is false, so shipping is 150)
    // Final = 2000 + 100 + 150 = 2250.
    
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.amount).toBe(2250);
    
    // Ensure the stock deduction was called
    expect(fakeTransaction.update).toHaveBeenCalledWith(expect.anything(), { stock: 8 });
  });

  it('blocks purchase if stock is insufficient (Race Condition mitigation)', async () => {
    const fakeTransaction = {
      get: vi.fn((ref) => {
        if (ref.id === 'SKU-LOW') {
          return {
            exists: true,
            data: () => ({ sku: 'SKU-LOW', price: 500, stock: 1 })
          };
        }
        return { exists: false };
      }),
      set: vi.fn(),
      update: vi.fn()
    };
    
    (adminDb.runTransaction as any).mockImplementation(async (cb: any) => await cb(fakeTransaction));

    const req = new Request('http://localhost/api/checkout/create-order', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'u2',
        items: [{ selectedVariant: { sku: 'SKU-LOW' }, quantity: 2 }]
      })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain('Insufficient stock');
  });
});
