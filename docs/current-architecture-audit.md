# JPS Fabrics - Current Architecture Audit

## 1. Existing Functionality
- **Authentication:** Firebase Auth is fully integrated with a custom `AuthContext`.
- **E-Commerce Flows:** 
  - Cart state is managed robustly with Zustand (`cartStore`).
  - Wishlist state is managed with Zustand (`wishlistStore`).
  - The Checkout flow `/checkout` captures address, delivery, and triggers a backend order creation API.
  - The Style Feed (`/feed`) is a TikTok-style immersive shoppable UI with double-tap-to-like and a "Shop the Look" carousel.
- **Product Display:** Collections and detailed product pages exist but need advanced filtering and fabric-specific displays (e.g. price per meter).
- **Graceful Degradation:** All data-fetching components have robust `catch` block fallbacks to `mockData.ts` to ensure the UI is fully functional even when Firestore blocks access or is empty.

## 2. Existing Architecture & Reusable Components
- **Framework:** Next.js 16 (App Router) with TypeScript and Tailwind CSS.
- **State Management:** Zustand for global state (`cartStore`, `wishlistStore`).
- **Styling:** Tailwind CSS with Framer Motion for premium animations (`Navbar`, `CustomCursor`, `CountdownBanner`, page transitions).
- **Mock Providers:** Architecture is decoupled to support `MockPaymentProvider`, `MockSearchProvider`, and `MockAIProvider` so development can proceed without live API credentials.
- **Mock Data:** A centralized `mockData.ts` handles the demo catalog and ensures UI continuity.

## 3. Existing Security & RBAC
- **Firebase Authentication:** Handles user identity.
- **Firebase Custom Claims (RBAC):** Users are assigned roles (admin, seller, customer) via backend Custom Claims, ensuring true server-side role isolation.
- **Firestore Security Rules:** `firestore.rules` enforces RBAC. Sellers can only edit their own products; Admins have global access; Customers have read-only access to products but full access to their own cart/orders.
- **Backend Order Validation:** The `/api/checkout/create-order` endpoint exists to server-validate prices, inventory, and coupons before initiating payment logic. Client totals are NOT trusted.
- **Variant Validation:** Strict variant inventory model prevents client-side arbitrary price manipulation.

## 4. Existing Bugs & Incomplete Features
- **Empty States:** The actual Firestore database is currently empty/inaccessible to unauthenticated users causing the app to rely heavily on the mock fallbacks. (Expected behavior until database is seeded).
- **Mega Menu:** The current Navbar is functional but does not yet support a deep mega-menu for fabric categories.
- **Fabric-Specific Commerce:** Features like "0.5 meter increments", GSM displays, and dynamic price-per-meter calculation need to be built into the core cart and product page logic.
- **Advanced Search:** Currently relies on basic exact matches or mock data; needs a robust typo-tolerant search UX.

## 5. Next Steps
We have a highly secure foundation. The priority is to build out the premium visual design system (Phase 1), upgrade the homepage to a true commerce portal (Phase 2), and build out the fabric-specific buying mechanics (Phase 7) without touching the secure backend infrastructure.
