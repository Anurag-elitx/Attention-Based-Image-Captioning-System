# TODO — Decisions & Replacements Needed Later

1. **Brand Identity (`frontend/src/config/site.ts`, `frontend/public/capgen-icon.svg`):**
   - Replace `name`, `tagline`, `copyright`, and `logoSrc` with your own brand name, icon SVG, and legal entity.
   - Update `footerColumns` (`Our Sites` links, `Contact`, `Terms`, `Privacy` targets).

2. **Pricing Plans & Billing (`frontend/src/data/pricing.ts`):**
   - Confirm final tier names, monthly/yearly dollar amounts, credit allowances, and feature bullets.
   - Connect `PricingCard` CTA actions to your checkout/subscription flow when ready.

3. **Dashboard Mock Data & User Profile (`frontend/src/data/dashboard.ts`):**
   - Replace `MOCK_DASHBOARD_USER` (name, email, avatar, credit count, plan) with authenticated user state.
   - Populate `MOCK_COLLECTIONS` (or connect to API history) and wire `Dropzone` + `VibeCard` submit button to your caption generation backend.
   - Customize `LANGUAGE_OPTIONS`, `TONE_OPTIONS`, and `LENGTH_OPTIONS` static arrays as needed.

4. **Blog Content (`frontend/src/data/posts.ts`):**
   - Replace placeholder/reference blog articles, author names, and dates with your own editorial content.

5. **Authentication Modals (`frontend/src/components/capgen/AuthModal.tsx`):**
   - Wire `Sign in` and `Create free account` forms to `AuthContext` / backend auth endpoints when moving beyond UI-only mode.
