---
name: typography
description: GwenUI typography system — Plus Jakarta Sans, Lora, and Space Mono usage, type scale, and hierarchy rules. Use when setting font sizes, weights, line heights, or deciding which font to use for UI, prose, or code.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Typography SKILL

## Overview

Standard guide for using typography in GwenUI — font families, scale, hierarchy,
and when each font is used. All fonts are self-hosted via `@gwenui/themes`.

---

## Font Families

### 1. Plus Jakarta Sans — UI Font (Primary)
Used for **all UI text** — headings, body, labels, buttons, nav, and all interface elements.

```css
font-family: 'Plus Jakarta Sans', sans-serif;
/* Tailwind: font-sans (after configuration in tailwind.config) */
```

Characteristics: Modern, geometric, humanistic. Highly readable at all sizes.
Available weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

---

### 2. Lora — Editorial Font (Prose)
Used for **long-form reading content** — articles, blog posts, long documentation, quote blocks.

```css
font-family: 'Lora', serif;
/* Tailwind: font-serif (after configuration) */
```

Characteristics: Classic serif, elegant, highly readable for long body text.
Available weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
Style: Regular + Italic

**When to use Lora:**
- Article/blog body text (`<article>`, `.prose`)
- Long pull quotes
- Long editorial hero subtitles (not standard UI subtitles)

**When NOT to use Lora:**
- UI labels, buttons, nav items
- Short taglines or headings in hero blocks
- Form elements

---

### 3. Space Mono — Code Font (Monospace)
Used **only for code** — inline code, code blocks, terminal output.

```css
font-family: 'Space Mono', monospace;
/* Tailwind: font-mono (after configuration) */
```

Characteristics: Sharp, technical, high contrast between characters.
Available weights: 400 (Regular), 700 (Bold)

**When to use Space Mono:**
- Inline `<code>`
- `<pre><code>` blocks
- Terminal/CLI output
- VirtualIDE in docs

**When NOT to use Space Mono:**
- Labels, tags, timestamps (use Plus Jakarta Sans)
- All non-code text

---

## Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans:  ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Lora", "serif"],
        mono:  ["Space Mono", "monospace"],
      },
    },
  },
}
```

---

## CSS Variables (Typography Tokens)

```css
/* @gwenui/themes — globals.css */
:root {
  /* Font families */
  --font-sans:  "Plus Jakarta Sans", sans-serif;
  --font-serif: "Lora", serif;
  --font-mono:  "Space Mono", monospace;

  /* Font sizes — fixed breakpoint scale */
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */
  --text-5xl:  3rem;       /* 48px */
  --text-6xl:  3.75rem;    /* 60px */

  /* Line heights */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose:  2;

  /* Letter spacing */
  --tracking-tight:  -0.025em;
  --tracking-normal:  0em;
  --tracking-wide:    0.025em;
  --tracking-wider:   0.05em;
  --tracking-widest:  0.1em;
}
```

---

## Typography Scale — UI (Plus Jakarta Sans)

### Heading Scale

| Role | Mobile | Desktop | Weight | Tracking | Usage |
|------|--------|---------|--------|----------|-------|
| Display | `text-4xl` | `text-6xl` | 700 | `-0.025em` | Main hero headline |
| H1 | `text-3xl` | `text-5xl` | 700 | `-0.025em` | Page title |
| H2 | `text-2xl` | `text-4xl` | 600 | `-0.015em` | Section heading |
| H3 | `text-xl` | `text-2xl` | 600 | `-0.01em` | Sub-section, card title |
| H4 | `text-lg` | `text-xl` | 600 | `0` | Small heading |
| H5 | `text-base` | `text-lg` | 500 | `0` | Label heading |

```tsx
// Display — main hero
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
  What should we build?
</h1>

// H2 — section heading
<h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
  Our Blocks
</h2>

// H3 — card title
<h3 className="text-lg md:text-xl font-semibold text-foreground">
  AI Chat Hero
</h3>
```

### Body Scale

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Body Large | `text-lg` | 400 | `1.625` | Lead paragraph, intro text |
| Body | `text-base` | 400 | `1.5` | Default body text |
| Body Small | `text-sm` | 400 | `1.5` | Secondary info, captions |
| Label | `text-sm` | 500 | `1.25` | Form labels, nav items |
| Caption | `text-xs` | 400 | `1.5` | Helper text, timestamps |
| Overline | `text-xs` | 600 | `1` | Category label above heading |

```tsx
// Body Large — lead paragraph
<p className="text-lg text-muted-foreground leading-relaxed">
  GwenUI is a dark-first block library...
</p>

// Overline — category label
<span className="text-xs font-semibold tracking-widest uppercase text-primary">
  Components
</span>

// Caption
<span className="text-xs text-muted-foreground">
  Updated 2 hours ago
</span>
```

---

## Typography Scale — Prose (Lora)

Used inside `<article>` or `.prose` wrapper.

```tsx
// Prose wrapper — apply to parent, children inherit
<article className="font-serif text-base md:text-lg text-foreground leading-relaxed max-w-prose">
  <p>Lorem ipsum...</p>
</article>
```

### Prose Scale

| Role | Size | Weight | Style | Usage |
|------|------|--------|-------|-------|
| Prose Heading | `text-2xl` | 700 | Normal | H2 in articles |
| Prose Sub-heading | `text-xl` | 600 | Normal | H3 in articles |
| Prose Body | `text-base` / `text-lg` | 400 | Normal | Main paragraph |
| Prose Lead | `text-xl` | 400 | Normal | First/intro paragraph |
| Prose Quote | `text-xl` | 400 | Italic | Blockquote |
| Prose Caption | `text-sm` | 400 | Normal | Image caption |

```tsx
// Blockquote — Lora italic
<blockquote className="font-serif text-xl italic text-muted-foreground border-l-2 border-primary pl-6 my-8">
  Design is not just what it looks like. Design is how it works.
</blockquote>

// Prose lead paragraph
<p className="font-serif text-xl text-foreground leading-relaxed mb-6 font-normal">
  GwenUI started as a personal project...
</p>
```

---

## Code Typography (Space Mono)

```tsx
// Inline code
<code className="font-mono text-sm bg-card border border-border rounded px-1.5 py-0.5 text-primary">
  gwenui add ai-chat-hero
</code>

// Code block
<pre className="font-mono text-sm bg-card border border-border rounded-xl p-4 overflow-x-auto">
  <code>{codeString}</code>
</pre>
```

---

## Color Pairing for Typography

```tsx
// Text color hierarchy — always use CSS variables / standard utility tokens
text-foreground        // oklch(97% 0.003 265) — primary text, heading
text-muted-foreground  // oklch(65% 0.008 265) — body, secondary
text-primary           // oklch(68% 0.18 48)   — accent, link, overline
text-white/40          // highly muted         — placeholder, disabled
text-white/60          // muted                — caption, helper text
```

---

## Responsive Typography Patterns

```tsx
// Standard GwenUI pattern — mobile first
// Display hero
"text-4xl md:text-5xl lg:text-6xl"

// Section heading
"text-2xl md:text-3xl lg:text-4xl"

// Sub heading
"text-xl md:text-2xl"

// Body that needs adjustment
"text-base md:text-lg"

// All labels, captions, overlines — no responsive adjustments needed
"text-xs"
"text-sm"
```

---

## Anti-patterns (Avoid)

```tsx
// Do not use font-mono for non-code
<span className="font-mono">Updated 2h ago</span>  // incorrect

// Do not use Lora for UI elements
<button className="font-serif">Click me</button>    // incorrect

// Do not hardcode font-family
<p style={{ fontFamily: "Plus Jakarta Sans" }}>...  // incorrect, use font-sans

// Do not use tracking-widest for large headings
<h1 className="text-6xl tracking-widest">...        // incorrect, use tracking-tight

// Do not skip heading hierarchy
<h1>Page Title</h1>
<h3>Sub section</h3>  // incorrect, skipped h2
```

---

## Checklist Before Done

- [ ] All UI text uses `font-sans` (Plus Jakarta Sans)
- [ ] Prose/article content uses `font-serif` (Lora)
- [ ] Code blocks use `font-mono` (Space Mono)
- [ ] Headings use `tracking-tight` or `tracking-normal`
- [ ] Overline/category label uses `tracking-widest uppercase text-xs font-semibold`
- [ ] Text colors use standard Tailwind utility classes (`text-foreground`, `text-muted-foreground`, `text-primary`)
- [ ] Responsive scale: headings use `text-Xsl md:text-Yl lg:text-Zl`
- [ ] No hardcoded `fontFamily` in style props
- [ ] Heading hierarchy does not skip levels (h1 → h2 → h3)
- [ ] Max width prose: `max-w-prose` or `max-w-[65ch]`
