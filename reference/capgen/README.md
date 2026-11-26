# CapGen.ai Reference — Phase 1 Capture Summary

> **Status:** ✅ Complete — ready for review before proceeding to Phase 2

## What's In This Directory

| File | Description |
|------|-------------|
| [design-tokens.json](./design-tokens.json) | Complete design token system: colors, typography, spacing, border-radius, shadows, transitions, breakpoints, and component-specific tokens |
| [landing-page-content.md](./landing-page-content.md) | All text copy from the landing page, structured by section |
| [pricing-page-content.md](./pricing-page-content.md) | Pricing plans (Free/Starter/Pro/Unlimited), FAQ content, and page structure |
| [blog-content.md](./blog-content.md) | Blog index (6 posts) + full article body for 3 posts |
| [dashboard-content.md](./dashboard-content.md) | Dashboard layout from user-provided screenshots (header, hero, upload card, vibe card, stats row, archive, footer) |
| [component-inventory.md](./component-inventory.md) | 29 distinct components with structure, states, and styling notes |
| [asset-list.md](./asset-list.md) | Fonts (Instrument Serif, Inter, Geist Mono), icons (Lucide), logo details, and effects |

### Screenshots
| File | Description |
|------|-------------|
| `../dashboard-top.png` | User-provided screenshot of dashboard (top half — header, hero, upload, vibe card) |
| `../dashboard-bottom.png` | User-provided screenshot of dashboard (bottom half — stats, archive, footer) |
| `screenshots/` | Directory for browser-captured screenshots (landing, pricing, blog) — browser connection was unavailable, so these may be empty |

## Design System Summary

### Color Palette
- **Background:** `#0c0f0a` (deep olive-black)
- **Surface:** `#161a11` (cards, inputs)
- **Border:** `#2a2f22` (default) / `#3a3f32` (strong)
- **Text Primary:** `#fafaf5` (warm off-white)
- **Text Secondary:** `#b0b3a8` (muted warm gray)
- **Text Muted:** `#6b6e63` (dark muted)
- **Accent Lime:** `#d2f34c` (yellow-lime — used for italic accent words, CTAs, progress bars, badges)

### Typography
- **Display Serif:** Instrument Serif — large headlines with italic lime accent words
- **Sans-Serif:** Inter — body text, nav, buttons, card titles
- **Monospace:** Geist Mono — labels, counters, platform lists, step numbers

### Key Design Patterns
1. **Italic lime accent words** in display headings (the brand's signature visual)
2. **Dark olive/near-black** backgrounds (not pure black)
3. **Warm muted grays** for secondary text (not cool/blue grays)
4. **Lime (#d2f34c)** as the only accent color — used for CTAs, badges, links, progress bars
5. **Dashed borders** with corner-bracket decorations on the upload dropzone
6. **Uppercase monospace labels** for section headers and metadata
7. **Pill-shaped buttons** for primary CTAs, squared for secondary controls
8. **Minimal shadows** — the design relies on borders and subtle bg shifts rather than elevation

## Existing Tech Stack (project)
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React (icons)
- clsx + tailwind-merge (class utilities)

## Pages to Build (Phase 2)
1. **Landing Page** — public homepage
2. **Pricing Page** — public pricing with plans + FAQ
3. **Blog Index** — public blog post grid
4. **Blog Post** — individual article layout
5. **Dashboard** — logged-in view with upload, vibe card, stats, collections

## Notes
- The browser scraping agents couldn't connect to Chrome (DevToolsActivePort issue), so screenshots from the live site were not captured. The first agent did succeed in providing a detailed text report before the connection dropped. All content and design data was gathered through that report plus web research.
- The pricing data from web search may mix capgen.ai and capgen.app — both are by Aculix Technologies LLP but have different products. The plans documented here (Free $0, Starter $9, Pro $19, Unlimited $39) are based on the capgen.ai image caption product.
- Dashboard screenshots provided by user were examined in detail and all elements are documented.
