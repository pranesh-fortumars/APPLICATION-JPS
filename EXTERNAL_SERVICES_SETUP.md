# External Services Setup & Architecture

This application uses a **Provider Adapter Architecture** for external services (Payment, Search, AI). This ensures that development can proceed securely using mocked providers until real credentials are provided.

## 1. Environment Configuration

Copy the `.env.example` file to `.env.local` in the root directory:

```bash
cp .env.example .env.local
```

### Modes
The application runs in one of two modes determined by the `EXTERNAL_SERVICES_MODE` variable:
- `EXTERNAL_SERVICES_MODE=mock`: Uses development mock adapters. Safe for testing business logic without real API keys.
- `EXTERNAL_SERVICES_MODE=live`: Uses real production providers. **Requires all API keys to be present or the application will crash.**

## 2. Setting Up Live Providers

### Razorpay (Payment)
1. Go to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to Settings > API Keys.
3. Generate a Test/Live Key.
4. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to your `.env.local`.

### Algolia (Search)
1. Go to the [Algolia Dashboard](https://dashboard.algolia.com/).
2. Navigate to Settings > API Keys.
3. Add `ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_API_KEY` (Secret), and `ALGOLIA_SEARCH_ONLY_API_KEY` (Public) to `.env.local`.
4. Define your index name in `ALGOLIA_INDEX_NAME` (e.g., `products_dev`).

### OpenAI (AI Stylist)
1. Go to the [OpenAI Platform](https://platform.openai.com/).
2. Navigate to API Keys and create a new secret key.
3. Add `OPENAI_API_KEY` to your `.env.local`.

## 3. Switching to Live
Once all credentials are in your `.env.local`, simply change:
```text
EXTERNAL_SERVICES_MODE=live
```
Restart your Next.js server. The backend will now route all traffic through the production adapters.

## 4. Security Warning
**NEVER expose these keys to the browser/client-side code:**
- `RAZORPAY_KEY_SECRET`
- `ALGOLIA_ADMIN_API_KEY`
- `OPENAI_API_KEY`
- `FIREBASE_PRIVATE_KEY`

These must only be accessed inside `src/app/api/...` or Server Actions.
