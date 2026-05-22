---
name: block-making
description: GwenUI Basic block patterns — section-level UI built on shadcn/ui reskinned with GwenUI tokens. Use when building, refactoring, or reviewing GwenUI blocks like hero, auth, pricing, testimonial, or any full-page section.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Block Making SKILL

## Overview

Standard guide for building blocks for GwenUI (`@gwenui/blocks`).
A block is a ready-to-use section-level UI component — users can simply run `gwenui add <block-name>`
and drop it into their projects. This document focuses on **Basic blocks (2D, MIT)**.
Supreme blocks have a separate SKILL document.

---

## Block vs Component

| | Component | Block |
|---|---|---|
| Scope | Atomic (Button, Input) | Section-level (Hero, Auth, Pricing) |
| Package | `@gwenui/react` | `@gwenui/blocks` |
| License | MIT | MIT (Basic) |
| Base UI | Radix UI | shadcn/ui (reskinned) |
| Size | Small, reusable | Large, opinionated |

---

## Stack

- **Base UI:** shadcn/ui components — must be reskinned with GwenUI tokens, do not use default shadcn colors
- **Styling:** Tailwind CSS v4 + `cn` utility
- **Animation:** Framer Motion — **at least 1 animation per block is required**
- **Icons:** Lucide React
- **Font:** Plus Jakarta Sans (via `@gwenui/themes`)

---

## Design Tokens (MUST use CSS variables)

```css
--primary:          oklch(68% 0.18 48);
--background:       oklch(10% 0.005 265);
--card:             oklch(13% 0.005 265);
--border:           oklch(68% 0.18 48 / 18%);
--foreground:       oklch(97% 0.003 265);
--muted-foreground: oklch(65% 0.008 265);
```

Never hardcode hex or oklch values — always use Tailwind utility classes.

---

## File Structure

```
<block-name>/
├── index.tsx              ← main component, default export
├── components/
│   └── *.tsx              ← sub-components (create if index.tsx > 150 lines)
├── hooks/
│   └── *.ts               ← custom hooks (optional)
├── block.json             ← metadata registry
└── README.md              ← usage docs
```

### When is `components/` needed?
- `index.tsx` is over 150 lines → split into sub-components
- There is a logically separate UI part (e.g., `ChatSidebar`, `ChatInput`)
- Sub-components are not exported outside the block

### When is `hooks/` needed?
- There is stateful logic that can be separated from the UI
- The logic is used by more than one sub-component

---

## Credit Header (REQUIRED)

```tsx
/**
 * Block: <Block Name>
 * Author: Implemented by JinXSuper
 * License: MIT
 */
```

With third-party credit:
```tsx
/**
 * Block: <Block Name>
 * Author: Implemented by JinXSuper
 * License: MIT
 *
 * Based on <Component Name> by <Source>
 * See: <URL>
 * License: MIT
 */
```

The header must be at the very top line, before "use client" and all imports.
All files within the block (index, components, hooks) must contain this header.

---

## `block.json` Format

```json
{
  "name": "block-name",
  "title": "Block Title",
  "description": "Short description of what this block does.",
  "category": "hero | auth | pricing | feature | testimonial | cta | nav | footer",
  "license": "MIT",
  "tags": ["tag1", "tag2"],
  "dependencies": ["framer-motion", "lucide-react"],
  "gwenui": {
    "theme": "gwen-noir",
    "type": "basic"
  }
}
```

---

## `README.md` Format

```md
# <Block Title>

<Short description>

## Usage

```bash
gwenui add <block-name>
```

```tsx
import <BlockName> from "@/components/blocks/<block-name>"

export default function Page() {
  return <BlockName />
}
```

## Props

| Prop | Type | Default |
|------|------|---------|
| ... | ... | ... |

## Credits (if any)

- [Name](url) by Source (MIT)
```

---

## shadcn/ui Reskin Rules

Blocks must use shadcn components as a base, but all colors must be overridden with GwenUI tokens:

```tsx
// Do not use shadcn's default colors
<Button variant="default">Click</Button>

// Override via className with GwenUI tokens
<Button className="bg-primary text-background hover:bg-primary/90 border-0">
  Click
</Button>
```

shadcn components that can be used as-is (just reskin):
`Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Tabs`,
`Dialog`, `Drawer`, `Accordion`, `Tooltip`, `Badge`, `Avatar`, `Separator`

---

## Responsiveness (MUST be fully responsive)

Every block must work across all breakpoints:

```
mobile:  375px+   → single column, stacked layout
tablet:  768px+   → 2 columns or adjusted layout
desktop: 1280px+  → full layout
```

Recommended pattern:
```tsx
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
"text-2xl md:text-3xl lg:text-4xl"
"px-4 md:px-8 lg:px-12"
"hidden md:flex"
```

---

## Data Fetching Rules

Depends on the block category:

| Category | Data Fetching |
|----------|---------------|
| `hero`, `cta`, `feature` | Pure UI, no fetch |
| `auth` | Pure UI, handler via `onSubmit` prop |
| `pricing` | Optional — can fetch if pricing is dynamic, provide a static fallback |
| `testimonial` | Optional — can fetch, provide `testimonials` prop as fallback |
| `nav`, `footer` | Pure UI, data via props |

Correct data fetching pattern:
```tsx
interface TestimonialGridProps {
  testimonials?: Testimonial[]   // if undefined, use default data
  className?: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [...]

export function TestimonialGrid({ testimonials = DEFAULT_TESTIMONIALS }: TestimonialGridProps) {
  // ...
}
```

---

## Animation Rules (Framer Motion)

At least 1 animation per block is required. Standard entrance animation:

```tsx
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
}

const container = {
  animate: { transition: { staggerChildren: 0.08 } }
}
```

Animation types per use case:
- Entrance (hero, headline): `fadeUp` with stagger delay
- Hover (cards, chips): subtle `whileHover={{ scale: 1.02 }}`
- Gesture (interactive): `whileTap={{ scale: 0.97 }}`
- Layout (tabs, accordion): `layoutId` for shared element transitions
- Overlay (dialog, drawer): `AnimatePresence` + `initial/exit`

---

## Props Interface Pattern

```tsx
interface BlockNameProps {
  headline?: string
  onSubmit?: (value: string) => void
  className?: string   // always present
}

// Default export, not named export
export default function BlockName({ headline = "Default", className }: BlockNameProps) {
  return (
    <section className={cn("w-full", className)}>
      {/* ... */}
    </section>
  )
}
```

---

## Portability Rules

Blocks must be drop-in ready for any project without extra configuration:

- No absolute imports outside the block folder (`@/lib/...`, `@/store/...`)
- No `"use server"` directives or server actions
- No global state (Zustand, Redux, Context from outside the block)
- All state must be local (`useState`, `useReducer`)
- External data must be passed via props with a default fallback
- `cn` utility can be imported from `@/lib/utils` (assumed to exist in shadcn setups)

---

## Checklist Before Done

- [ ] Credit header is present in all files (index + components + hooks)
- [ ] All colors use Tailwind utility classes, no hardcoding
- [ ] shadcn components are reskinned with GwenUI tokens
- [ ] At least 1 Framer Motion animation is included
- [ ] Fully responsive (375px to 1280px+)
- [ ] Default export in `index.tsx`
- [ ] `className` prop exists for extensibility
- [ ] `block.json` is complete
- [ ] `README.md` exists with usage + props table
- [ ] No absolute imports outside the block (except `@/lib/utils`)
- [ ] No `"use server"` or server actions
- [ ] Data fetching follows category rules
