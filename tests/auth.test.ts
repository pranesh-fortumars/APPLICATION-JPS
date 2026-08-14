import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/set-role/route';
import { adminAuth } from '@/lib/firebase/admin';

describe('Auth & RBAC API (/api/auth/set-role)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks unauthenticated requests', async () => {
    const req = new Request('http://localhost/api/auth/set-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: 'target123', role: 'admin' })
    });
    
    // Create a mock NextRequest (not exact, but enough for our logic which reads headers)
    const response = await POST(req as any);
    expect(response.status).toBe(401);
  });

  it('prevents a customer from escalating privileges to admin', async () => {
    // Mock VerifyIdToken to return a standard user
    (adminAuth.verifyIdToken as any).mockResolvedValueOnce({
      uid: 'hacker123',
      role: 'customer'
    });

    const req = new Request('http://localhost/api/auth/set-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake_token'
      },
      body: JSON.stringify({ uid: 'hacker123', role: 'admin' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain('Forbidden');
  });

  it('allows a super_admin to set roles', async () => {
    (adminAuth.verifyIdToken as any).mockResolvedValueOnce({
      uid: 'superadmin123',
      super_admin: true
    });
    (adminAuth.setCustomUserClaims as any).mockResolvedValueOnce(undefined);

    const req = new Request('http://localhost/api/auth/set-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer real_admin_token'
      },
      body: JSON.stringify({ uid: 'target123', role: 'seller' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(200);
    expect(adminAuth.setCustomUserClaims).toHaveBeenCalledWith('target123', { seller: true });
  });
});
