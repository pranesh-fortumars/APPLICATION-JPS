import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Firebase Admin SDK for testing business logic securely
vi.mock('@/lib/firebase/admin', () => {
  return {
    adminDb: {
      collection: vi.fn(() => ({
        doc: vi.fn((idStr?: string) => {
          const generatedId = idStr || Math.random().toString(36).substring(7);
          return {
            id: generatedId,
            get: vi.fn().mockResolvedValue({
              exists: true,
              data: () => ({ totalPrice: 2250 })
            }),
            set: vi.fn(),
            update: vi.fn(),
          };
        }),
      })),
      runTransaction: vi.fn(async (callback) => {
        // Simple transaction mock
        const transaction = {
          get: vi.fn(),
          set: vi.fn(),
          update: vi.fn(),
        };
        return await callback(transaction);
      }),
    },
    adminAuth: {
      verifyIdToken: vi.fn(),
      setCustomUserClaims: vi.fn(),
      getUser: vi.fn(),
    }
  };
});
