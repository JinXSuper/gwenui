---
name: component-making
description: GwenUI atomic component patterns using Radix UI, CVA, and Framer Motion. Use when building, refactoring, or reviewing React components — buttons, inputs, cards, modals, or any UI primitive for GwenUI.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Component Making SKILL

## Overview

Standard guide for building atomic components for GwenUI (`@gwenui/react`).
These components are the foundation of all blocks — they must be consistent, portable, and clean.

---

## Stack

- **Primitive:** Radix UI
- **Styling:** Tailwind CSS v4 + CVA (`class-variance-authority`) + `cn` utility
- **Animation:** Framer Motion — only when the component requires interactions/transitions that cannot be achieved with standard CSS transitions
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

Never hardcode hex or oklch values directly in the component — always use Tailwind utility classes.

---

## File Structure

```
components/
└── button.tsx          ← flat, one file per component
└── input.tsx
└── card.tsx
└── badge.tsx
└── ...
```

- Naming: **kebab-case**, flat, no subfolders
- One file = one component (sub-parts can exist in the same file, e.g., `CardHeader`, `CardBody`)

---

## Credit Header (REQUIRED in every file)

```tsx
/**
 * Component: <Component Name>
 * Author: Implemented by JinXSuper
 * License: MIT
 */
```

If based on a third-party resource:
```tsx
/**
 * Component: <Component Name>
 * Author: Implemented by JinXSuper
 * License: MIT
 *
 * Based on <Name> by <Source>
 * See: <URL>
 * License: MIT
 */
```

The header must be at the **very top**, before `"use client"` and all imports.

---

## Props Interface Pattern

A mix between extending HTML elements and custom props:

```tsx
// If the component wraps an HTML element → extend
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
}

// If the component is purely visual/decorative → custom props only
interface BadgeProps {
  label: string
  variant?: "default" | "pulse"
  className?: string
}
```

---

## forwardRef Policy

**Use `forwardRef`** if the component:
- Wraps interactive HTML elements (`button`, `input`, `textarea`, `select`)
- Is used with form libraries or needs a DOM ref from the parent
- Involves focus management (Radix triggers, dialogs, tooltips)

**DO NOT use `forwardRef`** if the component:
- Is purely visual/decorative without complex DOM interaction
- Examples: `Card`, `Alert`, `Badge`, `Tag`, layout wrappers (`Grid`, `Section`)

---

## Variants with CVA

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // base classes
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-background hover:bg-primary/90",
        ghost: "bg-transparent text-foreground hover:bg-white/4 hover:backdrop-blur-md",
        outline: "bg-transparent border border-border text-foreground hover:border-border/70",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

---

## Animation Rules

### Use CSS transition (default):
```tsx
// Hover, focus, active states → always CSS transition
"transition-all duration-150"
"transition-colors duration-200"
```

### Use Framer Motion if:
- The component has a **mount/unmount animation** (Dialog, Toast, Dropdown)
- There is a **gesture interaction** (drag, press with spring)
- There is a **layout animation** (`layoutId`, shared element transition)
- CSS transitions are not sufficient to achieve the desired effect

### DO NOT use Framer Motion if:
- It's just a hover color change
- A simple opacity toggle
- A static decorative component

---

## Radix UI Integration Pattern

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"

// Wrap Radix primitive with motion if animation is needed
const DialogContent = React.forwardRef<...>(({ children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <DialogPrimitive.Content ref={ref} {...props}>
          {children}
        </DialogPrimitive.Content>
      </motion.div>
    </AnimatePresence>
  </DialogPrimitive.Portal>
))
```

---

## `cn` Utility

Always use `cn` to merge classes:

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Checklist Before Done

- [ ] Credit header is at the very top line
- [ ] All colors use Tailwind utility classes, no hardcoding
- [ ] CVA is used for variants
- [ ] `forwardRef` is only used when necessary
- [ ] Props interface extends HTML elements if interactive
- [ ] Animation: CSS transitions for hover/focus, Framer Motion only when necessary
- [ ] `cn()` is used for merging classNames
- [ ] Flat kebab-case file naming
- [ ] No absolute imports outside `@gwenui/react`
