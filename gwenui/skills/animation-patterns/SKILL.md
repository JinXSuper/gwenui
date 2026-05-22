---
name: animation-patterns
description: GwenUI animation patterns for CSS Transition, Framer Motion, and GSAP. Use when adding animations, transitions, or motion to any GwenUI component or block — includes official GwenUI easing presets and animation variants.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Animation Patterns SKILL

## Overview

Standard guide for using animations in GwenUI — when to use CSS Transitions,
Framer Motion, or GSAP. Includes GwenUI official animation presets.

---

## Animation Library Decision Tree

```
Need animations?
│
├── Simple hover / focus / color change
│   └── → CSS Transition
│
├── Entrance, exit, gesture, layout, scroll-triggered
│   └── → Framer Motion
│
└── Complex timeline, path animation, canvas, or Supreme block
    └── → GSAP
```

---

## 1. CSS Transition

### When to Use
- Hover states (color, border, shadow, opacity)
- Focus rings
- Simple scaling on buttons/cards
- Any state change that does not require `AnimatePresence` or mount/unmount behaviors

### When NOT to Use
- Mounting/unmounting elements (use `AnimatePresence` instead)
- Animations requiring stagger delays between children
- Animations requiring custom non-cubic easing functions

### GwenUI Standard Classes
```tsx
// Default — most frequently used
"transition-all duration-150"

// Color/border only
"transition-colors duration-200"

// Opacity only
"transition-opacity duration-200"

// Transform only
"transition-transform duration-200"

// Slower transitions for overlays/panels
"transition-all duration-300"
```

### CSS Easing
```css
/* Default browser ease — suitable for basic hover states */
transition-timing-function: ease;

/* Snappier, recommended for interactive elements */
transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);  /* expo out */

/* Smooth easing for overlays */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);   /* material standard */
```

### Examples
```tsx
// Button hover
<button className="bg-primary transition-all duration-150 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.97]">
  Click
</button>

// Card hover
<div className="border border-border transition-all duration-200 hover:border-border/70 hover:shadow-lg hover:shadow-primary/5">
  Card
</div>
```

---

## 2. Framer Motion

### Easing Reference

| Name | Curve | When to Use |
|------|-------|-------------|
| `easeOut` | Fast start, slow end | Entrance animations — elements coming onto the screen |
| `easeIn` | Slow start, fast end | Exit animations — elements leaving the screen |
| `easeInOut` | Slow start & end | Elements moving from point A to B (repositioning) |
| `linear` | Constant speed | Loading spinners, infinite loops, progress bars |
| `[0.16, 1, 0.3, 1]` | Expo out | GwenUI default — snappy entrance, premium feel |
| `[0.4, 0, 0.2, 1]` | Material standard | Sliding panels, opening drawers |
| `[0.34, 1.56, 0.64, 1]` | Back out (slight overshoot) | Playful pop — badges, chips, notifications |

### GwenUI Official Easing Presets

```ts
// lib/animation.ts — copy to any project that needs it
export const gwenEase = {
  default:   [0.16, 1, 0.3, 1],      // expo out — all entrances
  smooth:    [0.4, 0, 0.2, 1],        // material — panels, drawers
  playful:   [0.34, 1.56, 0.64, 1],   // back out — badges, pops
  linear:    "linear",                 // spinners, progress bars
} as const
```

---

### GwenUI Official Animation Presets

```ts
// lib/animation.ts (continued)
import { Variants } from "framer-motion"

// 1. Fade Up — standard entrance animation for all blocks
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: gwenEase.default } },
  exit:    { opacity: 0, y: 8,  transition: { duration: 0.2, ease: "easeIn" } },
}

// 2. Fade In — for overlays, modal backdrops
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease: gwenEase.smooth } },
  exit:    { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
}

// 3. Scale In — for dropdowns, popovers, tooltips
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1,    transition: { duration: 0.2, ease: gwenEase.default } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
}

// 4. Slide Up — for bottom drawers, toasts
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.35, ease: gwenEase.smooth } },
  exit:    { opacity: 0, y: 20, transition: { duration: 0.2,  ease: "easeIn" } },
}

// 5. Slide Right — for side drawers, sidebars
export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0,   transition: { duration: 0.35, ease: gwenEase.smooth } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.2,  ease: "easeIn" } },
}

// 6. Pop — for badges, chips, notification dots
export const pop: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1,   transition: { duration: 0.3, ease: gwenEase.playful } },
  exit:    { opacity: 0, scale: 0.8, transition: { duration: 0.15, ease: "easeIn" } },
}

// 7. Stagger Container — wrapper to stagger children elements
export const staggerContainer: Variants = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0 }
  },
}

// 8. Stagger Container (slow) — for grid cards, list items
export const staggerContainerSlow: Variants = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  },
}
```

### How to Use Presets
```tsx
import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "@/lib/animation"

// Single element
<motion.h1 variants={fadeUp} initial="initial" animate="animate">
  Headline
</motion.h1>

// Stagger list
<motion.ul variants={staggerContainer} initial="initial" animate="animate">
  {items.map((item) => (
    <motion.li key={item.id} variants={fadeUp}>
      {item.label}
    </motion.li>
  ))}
</motion.ul>
```

---

### Spring

Use spring physics for animations that require a **physical and natural feel** — not for standard entrance/exit animations.

```ts
// When to use spring:
// - Drag & drop interactions
// - Swipe gestures
// - Toggle switches
// - Sliders/knobs

// When NOT to use spring:
// - Block/page entrance animations (use fadeUp instead)
// - Overlay open/close actions (use fadeIn/slideUp instead)

// GwenUI spring presets
export const gwenSpring = {
  // Snappy — toggles, switches
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  // Bouncy — drag release, playful elements
  bouncy: { type: "spring", stiffness: 300, damping: 20 },
  // Smooth — repositioning, layout shifts
  smooth: { type: "spring", stiffness: 200, damping: 25 },
} as const

// Example: Toggle Switch
<motion.div
  layout
  transition={gwenSpring.snappy}
  className="absolute inset-y-0 left-0 w-5 h-5 bg-white rounded-full"
/>
```

---

### Keyframes

Use keyframes for **multi-step** animations — loading states, pulses, shimmers.

```tsx
// When to use keyframes:
// - Loading skeleton shimmer
// - Pulsing badges/dots
// - Infinite loop animations
// - Complex multi-step entrance animations

// Example: Pulse dot (status indicator)
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
  }}
  transition={{
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  }}
  className="w-2 h-2 rounded-full bg-primary"
/>

// Example: Shimmer loading
<motion.div
  animate={{ x: ["-100%", "100%"] }}
  transition={{
    duration: 1.5,
    ease: "linear",
    repeat: Infinity,
  }}
  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
/>
```

---

### AnimatePresence

Must be used for **mount/unmount** animations — dialogs, drawers, toasts, dropdowns, conditional rendering.

```tsx
// Rules:
// - Always wrap with AnimatePresence
// - Component must feature an `exit` variant or prop
// - A `key` prop is required when switching between elements

import { AnimatePresence, motion } from "framer-motion"
import { fadeIn, scaleIn } from "@/lib/animation"

// Example: Dialog
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Content */}
      <motion.div
        key="dialog"
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ..."
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>

// Example: Switching tab contents
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    variants={fadeUp}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {tabContent[activeTab]}
  </motion.div>
</AnimatePresence>
```

---

### Scroll-Triggered (useInView)

Use for animations triggered when an element enters the viewport — blocks, sections, cards.

```tsx
// When to use:
// - Block/section entrance on scroll
// - Card grids appearing one by one
// - Stats counters that start counting when visible

// When NOT to use:
// - Above-the-fold content (animate immediately without scroll triggers)
// - Elements that are always visible

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { fadeUp, staggerContainerSlow } from "@/lib/animation"

// Example: Section with staggered cards
function FeatureSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,      // animate only once
    margin: "-100px" // trigger 100px before the element enters the viewport
  })

  return (
    <motion.div
      ref={ref}
      variants={staggerContainerSlow}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
    >
      {features.map((feature) => (
        <motion.div key={feature.id} variants={fadeUp}>
          <FeatureCard {...feature} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

---

## 3. GSAP

### When to Use in GwenUI

| Use Case | Library |
|----------|---------|
| Entrance, exit, gesture, basic scroll | Framer Motion |
| Complex timeline, sequenced multi-element animations | GSAP |
| Path/SVG animations | GSAP |
| Canvas animations | GSAP |
| Supreme blocks (WebGL, particles, 3D UI) | GSAP (dominant) |
| Framer Motion is insufficient to achieve the effect | GSAP (fallback) |

### GSAP is NOT used for Basic blocks
Basic blocks must use Framer Motion. GSAP is only introduced if:
1. The desired effect is literally impossible to achieve with Framer Motion.
2. The block is categorized as a Supreme block.

### GSAP Patterns in Supreme Blocks

```tsx
"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ParallaxHero() {
  const containerRef = useRef(null)
  const layerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sequenced timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      })

      tl.to(layerRef.current, { y: -100, ease: "none" })
    }, containerRef)

    // Cleanup — mandatory
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef}>
      <div ref={layerRef}>...</div>
    </div>
  )
}
```

### GSAP Easing Reference

```ts
// Most frequently used GSAP built-in easings
"power1.out"   // light, subtle — hovers, soft entrances
"power2.out"   // medium — standard entrances
"power3.out"   // strong — hero entrances, dramatic effects
"power4.out"   // extremely strong — highly dramatic
"expo.out"     // equivalent to [0.16, 1, 0.3, 1] — snappy, premium feel
"back.out(1.7)"  // slight overshoot — playful effects
"elastic.out(1, 0.3)"  // bouncy — use cautiously, easily overdone
"none"         // linear — scrub, progress, infinite loops
```

**Rule of thumb:**
- `.out` → for elements **entering** the screen (entrance)
- `.in` → for elements **leaving** the screen (exit)
- `.inOut` → for elements **moving** from A to B (transitioning)

---

## Quick Reference — Which One to Choose?

| Scenario | Choice |
|---------|---------|
| Color / border / shadow hover | CSS Transition |
| Button press feedback | CSS Transition (`active:scale-[0.97]`) |
| Block entrance on load | Framer Motion `fadeUp` |
| Block entrance on scroll | Framer Motion `useInView` + `fadeUp` |
| Dialog / Drawer / Toast open-close | Framer Motion `AnimatePresence` |
| Toggle / Switch | Framer Motion `spring` |
| Pulse / Shimmer / Loading loop | Framer Motion `keyframes` |
| Tab content switch | Framer Motion `AnimatePresence mode="wait"` |
| Multi-element sequenced timeline | GSAP |
| Scroll-linked parallax | GSAP `ScrollTrigger` |
| SVG path draw | GSAP |
| Supreme block (WebGL, 3D, canvas) | GSAP (dominant) |
