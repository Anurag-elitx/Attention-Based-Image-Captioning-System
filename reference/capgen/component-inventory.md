# Component Inventory — capgen.ai

## Shared Components (used across all pages)

### 1. Header / Navbar
- **Structure:** Logo (left) · Nav links (center) · CTA or user controls (right)
- **Public state:** "Try it free →" button (lime text, arrow)
- **Logged-in state:** Credits pill (green dot + count) + circular avatar
- **Behavior:** Sticky top, dark background (#0c0f0a)
- **Height:** ~64px

### 2. Footer
- **Structure:** 4-column layout on desktop
  - Col 1: Logo + tagline
  - Col 2: Product links
  - Col 3: Resources links
  - Col 4: Our Sites links
  - Below: Copyright line (mono)
- **Background:** Same as page (#0c0f0a)
- **Border:** Subtle top border (#2a2f22)

### 3. CTA Button (Primary / Lime)
- **Style:** Pill shape (full border-radius), lime bg (#d2f34c), dark text (#0c0f0a)
- **States:** Default, hover (lighter lime + subtle glow), disabled (muted bg), loading
- **Arrow:** → suffix on most CTAs

### 4. CTA Button (Outline)
- **Style:** Pill shape, transparent bg, border (#3a3f32), light text
- **States:** Default, hover (lime border + lime text)

### 5. Mono Label
- **Style:** Uppercase, monospace font, small (11px), letter-spacing 0.1em
- **Color:** Muted (#6b6e63) or lime (#d2f34c) for step labels
- **Used for:** Section headers, step labels, stat labels, counters

### 6. Display Heading
- **Font:** Instrument Serif, 400 weight
- **Pattern:** Regular text with *italic accent words* in lime
- **Period trick:** Final period in lime color
- **Sizes:** 72px (hero), 48px (sections), 36px (sub-sections)

---

## Landing Page Components

### 7. Dropzone / Upload Card
- **Border:** 2px dashed, rounded (12-16px radius)
- **Corner brackets:** Decorative L-shaped marks at each corner
- **Icon:** Circular upload arrow (centered)
- **Text hierarchy:** Title → subtitle → keyboard shortcut hint
- **States:** Default, hover (brighter border), drag-over (lime border + subtle bg tint)

### 8. Vibe Card
- **Background:** Surface color (#161a11)
- **Border:** 1px solid (#2a2f22)
- **Contains:** Title, credit badge pill, 3 select dropdowns, CTA button, platform list

### 9. Select / Dropdown
- **Style:** Dark bg (#1a1e14), border (#2a2f22), rounded (8px)
- **Chevron:** Right-aligned down arrow icon
- **Label above:** Uppercase mono (LANGUAGE, TONE, LENGTH)
- **States:** Default, focus (lighter border), open (dropdown menu)

### 10. Credits Pill
- **Style:** Dark bg, rounded pill, border
- **Content:** Green dot (●) + "N credits" in mono font
- **Used in:** Header (logged-in state)

### 11. Free Credits Badge
- **Style:** Rounded pill, lime bg (muted/translucent), lime border, lime text
- **Content:** "2 FREE CREDITS · ON US"
- **Used in:** Vibe card

### 12. How It Works Card
- **Structure:** Step number (mono) + title (sans bold) + description (sans body)
- **Background:** Surface (#161a11)
- **Border:** 1px solid (#2a2f22), rounded (12px)
- **Layout:** 3 cards in a row on desktop

### 13. Platform Card
- **Structure:** Icon + platform name + description
- **Background:** Surface (#161a11)
- **Border:** 1px solid (#2a2f22), rounded (12px)
- **Layout:** 2×4 or 4×2 grid on desktop
- **Hover:** Subtle border color change

### 14. Stats Card
- **Structure:** Large number + label text
- **Layout:** 4 items in a row on desktop

### 15. KBD / Keycap
- **Style:** Inline kbd element, dark bg (#1a1e14), border (#3a3f32), rounded (4px)
- **Font:** Monospace, small (12px)
- **Used for:** Ctrl, V keyboard shortcuts

---

## Dashboard Components

### 16. Stats Row (4 cells)
- **Layout:** Single bordered card with 4 equal columns, divided by borders
- **Each cell:** Mono label (top) → large number → description text → optional progress bar
- **Progress bar:** Lime color (#d2f34c), thin height

### 17. Collections Toolbar
- **Contains:** Search input + sort toggle (Newest/Oldest) + view toggle (Grid/List) + filter chips
- **Layout:** Horizontal flex row, wraps on mobile

### 18. Search Input
- **Style:** Dark bg, border, rounded, search icon (left), placeholder text
- **States:** Default, focus (lighter border or lime border)

### 19. Segmented Control / Toggle
- **Style:** Grouped buttons in a bordered container
- **Active state:** Slightly lighter bg, white text
- **Inactive state:** Transparent bg, muted text
- **Used for:** Newest/Oldest, Grid/List

### 20. Filter Chip
- **Style:** Small bordered pill, "All" text
- **Active state:** Lime bg, dark text
- **Inactive state:** Dark bg, light border, light text

### 21. Empty State Box
- **Style:** Dashed border, centered text
- **Text:** "No generations yet. Drop a photo above to get your first 8 captions."

---

## Pricing Page Components

### 22. Billing Toggle
- **Style:** Segmented control (Monthly / Yearly)
- **Badge:** "Save 20%" attached to yearly option
- **Active bg:** Slightly highlighted

### 23. Pricing Card
- **Structure:** Plan name → price → period → CTA button → feature list
- **Popular variant:** Lime border, "MOST POPULAR" badge, filled CTA button
- **Normal variant:** Default border, outline CTA button
- **Layout:** 4 cards in a row on desktop, stacked on mobile

### 24. Feature List Item
- **Style:** Checkmark icon (✓) + feature text
- **Color:** Muted text with checkmark in lime or white

### 25. FAQ Accordion
- **Structure:** Question (clickable) + answer (expandable)
- **Divider:** Bottom border (#2a2f22)
- **Icon:** Plus/minus or chevron (right-aligned)
- **States:** Collapsed (question only), expanded (question + answer)

---

## Blog Page Components

### 26. Blog Card
- **Structure:** Category pill → title → date → excerpt
- **Background:** Surface (#161a11) or transparent
- **Border:** 1px solid (#2a2f22), rounded (12px)
- **Layout:** 2-column grid on desktop, 1-column on mobile
- **Hover:** Subtle border color change, slight lift

### 27. Category Pill (Blog)
- **Style:** Small pill, translucent lime bg, lime text, uppercase mono
- **Categories:** TIPS, PRODUCT, SOCIAL MEDIA

### 28. Article Layout
- **Max width:** ~720px, centered
- **Typography:** Display serif heading, sans body, generous line-height (1.7)
- **Meta:** Category pill + date + reading time
- **CTA card:** Bottom of article, linking to try CapGen

### 29. Reading Time Badge
- **Style:** Muted text, inline with date
- **Format:** "X min read"
