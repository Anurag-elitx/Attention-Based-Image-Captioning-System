# Changelog

## UI Replica Implementation

- **Design System & Tokens (`frontend/index.html`, `frontend/src/index.css`):**
  - Loaded `Instrument Serif`, `Geist`, and `Geist Mono` from Google Fonts.
  - Defined exact CSS variables (`--ink: #0a0a0b`, `--ink-2: #101013`, `--ink-3: #17171b`, `--line: #23232a`, `--line-2: #2e2e37`, `--paper: #f5f3ec`, `--paper-dim: #b8b5ac`, `--muted: #888891`, `--lime: #c8ff4d`, `--lime-ink: #0a0a0b`), ambient radial hero background gradients, responsive container sizing, and layout grids.

- **Centralized Brand Config & Static Data (`frontend/src/config/site.ts`, `frontend/src/data/`):**
  - `site.ts`: Centralized site name, logo asset, tagline, copyright, navigation links, footer columns (`Product`, `Resources`, `Our Sites`), and social network metadata.
  - `landing.ts`: Interactive hero demo slides & captions, 7 showcase bento items, 4 testimonials, 5 bento feature card datasets, and 7 landing FAQs.
  - `pricing.ts`: Starter (`$4.99/mo`), Studio (`$9.99/mo` Popular), and Scale (`$19.99/mo` Best Value) plans with monthly/yearly pricing, trust highlights, and 8 billing FAQs.
  - `posts.ts`: 12 blog posts, 9 filter categories, and rich article content blocks.
  - `dashboard.ts`: Static `LANGUAGE_OPTIONS`, `TONE_OPTIONS`, `LENGTH_OPTIONS`, mock user, stats, and empty collections state.

- **Reusable Components (`frontend/src/components/capgen/`):**
  - `Header`, `Footer`, `CreditsPill`, `NetIcon`, `Dropzone`, `VibeCard`, `StatCard`, `CollectionsToolbar`, `PricingCard`, `BlogCard` (+ `BlogVisual`), `FaqAccordion`, `CtaBanner`, and `AuthModal`.

- **Pages (`frontend/src/pages/`):**
  - `LandingPage` (`/`), `PricingPage` (`/pricing`), `BlogIndexPage` (`/blog`), `BlogPostPage` (`/blog/:slug`), `DashboardPage` (`/dashboard`, `/studio`), `CapgenLoginPage` (`/login`, `/signin`), and `CapgenSignupPage` (`/signup`, `/register`) using shared `AuthShell` without Google/Apple OAuth buttons.
