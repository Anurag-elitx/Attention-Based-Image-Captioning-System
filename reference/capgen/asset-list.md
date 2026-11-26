# Asset List — capgen.ai

## Fonts (all available on Google Fonts)

### 1. Instrument Serif
- **Usage:** Display headlines, logo wordmark, italic accent words
- **Weights:** 400 (regular), 400 italic
- **Google Fonts:** https://fonts.google.com/specimen/Instrument+Serif
- **CSS:** `font-family: 'Instrument Serif', serif;`

### 2. Inter
- **Usage:** Body text, navigation links, button labels, card titles, descriptions
- **Weights:** 400, 500, 600, 700
- **Google Fonts:** https://fonts.google.com/specimen/Inter
- **CSS:** `font-family: 'Inter', system-ui, sans-serif;`

### 3. Geist Mono
- **Usage:** Uppercase labels, step numbers, stats labels, credits pill, counters, platform lists
- **Weights:** 400, 500, 600
- **Google Fonts:** https://fonts.google.com/specimen/Geist+Mono
- **CSS:** `font-family: 'Geist Mono', monospace;`

## Google Fonts Import Link
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

## Logo
- **Icon:** Decorative asterisk/snowflake symbol (✳ or ✦ — 6-pointed with rotation)
  - Could be rendered as an SVG, Unicode character (✳ U+2733), or custom icon
  - Color: Same as text (#fafaf5 on dark, or lime in some contexts)
- **Wordmark:** "CapGen" in Instrument Serif italic
- **Layout:** Icon + wordmark side by side, vertically centered

## Favicon
- Snowflake/asterisk icon, likely lime (#d2f34c) or white on dark background
- Could be a 32×32 or 16×16 PNG, or an SVG favicon

## Icons (can be sourced from Lucide React — already in project dependencies)
- **Upload arrow:** `Upload` or `ArrowUp` in a circle
- **Search:** `Search`
- **Grid view:** `LayoutGrid` or `Grid3X3`
- **List view:** `List`
- **Chevron down:** `ChevronDown` (for select dropdowns)
- **Plus/Minus:** `Plus` / `Minus` (for FAQ accordion)
- **Check:** `Check` (for pricing feature lists)
- **Arrow right:** `ArrowRight` (for CTA buttons)
- **Copy:** `Copy` (for copy-to-clipboard)
- **User:** `User` or `CircleUser` (for avatar fallback)

## Platform Icons
For the 8 social platforms, options:
1. Use simple SVG icons (custom or from Simple Icons)
2. Use text-only platform names (as shown in some parts of the site)
3. Source from lucide-react where available

Platforms: Instagram, TikTok, Facebook, X, Threads, WhatsApp, Snapchat, LinkedIn

## Images
- No hero images or background images are used (design is purely typographic)
- User avatar is a circular image placeholder
- Blog posts may have optional hero/thumbnail images (not visible in current cards)

## Gradients / Effects
- Subtle radial gradient glow behind hero section (lime-tinted, very low opacity)
- CSS example: `radial-gradient(ellipse at center top, rgba(210, 243, 76, 0.05) 0%, transparent 60%)`
