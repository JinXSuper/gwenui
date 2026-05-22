---
name: tokens
description: GwenUI design tokens — complete CSS variable reference for colors, radius, shadow, and typography. Use when applying colors, borders, shadows, or any design token in GwenUI components or blocks.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Tokens SKILL

## Overview

Complete guide to GwenUI design tokens — all CSS variables, when to use them,
and how to use them in Tailwind v4. These tokens are the **source of truth** for all
components and blocks. Dual theme: Light (Guinevere) + Dark (Gwen Noir).

---

## Setup

```css
/* globals.css */
@import "tailwindcss";
@custom-variant dark (&:is(.dark *));
```

Tokens are consumed via `@theme inline` — immediately available as Tailwind classes:
`bg-background`, `text-foreground`, `border-border`, etc.

---

## Color Tokens

### Background & Surface

| Token | Light | Dark | Used For |
|-------|-------|------|---------------|
| `--background` | `oklch(0.9705 0.0098 87.47)` | `oklch(0.1895 0.0496 296.10)` | Page background |
| `--card` | `oklch(0.9907 0.0054 95.10)` | `oklch(0.2403 0.0894 295.41)` | Card, elevated surfaces |
| `--popover` | `oklch(0.9705 0.0098 87.47)` | `oklch(0.2403 0.0894 295.41)` | Dropdown, popover bg |
| `--muted` | `oklch(0.9297 0.0201 84.59)` | `oklch(0.2500 0.0306 46.08)` | Muted section bg, skeleton |
| `--sidebar` | same as `--background` | same as `--background` | Sidebar background |
| `--input` | `oklch(0.9206 0.0202 84.59)` | `oklch(0.2201 0.0412 46.45)` | Input field background |

```tsx
// Usage
<div className="bg-background">          // page bg
<div className="bg-card">               // card
<div className="bg-muted">              // muted section
<input className="bg-input" />          // input field
```

---

### Text / Foreground

| Token | Light | Dark | Used For |
|-------|-------|------|---------------|
| `--foreground` | `oklch(0.1895 0.0496 296.10)` | `oklch(0.9705 0.0098 87.47)` | Primary text |
| `--card-foreground` | same as `--foreground` | `oklch(0.9907 0.0054 95.10)` | Text on top of card |
| `--popover-foreground` | same as `--foreground` | same as `--foreground` | Text inside popover |
| `--muted-foreground` | `oklch(0.4513 0.0301 49.30)` | `oklch(0.7505 0.0301 84.58)` | Secondary/muted text |
| `--sidebar-foreground` | same as `--foreground` | same as `--foreground` | Text inside sidebar |

```tsx
// Usage
<p className="text-foreground">          // primary text
<p className="text-muted-foreground">    // secondary, caption, helper
<p className="text-card-foreground">     // text inside card
```

---

### Primary (Gwen Orange)

| Token | Light | Dark | Used For |
|-------|-------|------|---------------|
| `--primary` | `oklch(0.7204 0.1507 48.04)` | `oklch(0.6493 0.1496 47.92)` | CTA button, link, main accent |
| `--primary-foreground` | `oklch(0.1895 0.0496 296.10)` | `oklch(0.2498 0.0511 47.30)` | Text on top of primary bg |

```tsx
// Usage
<button className="bg-primary text-primary-foreground">
  Get started
</button>

// Ring / focus
<input className="ring-ring focus-visible:ring-2" />
```

---

### Secondary (Warm Gold)

| Token | Light | Dark | Used For |
|-------|-------|------|---------------|
| `--secondary` | `oklch(0.8193 0.1001 84.67)` | `oklch(0.2305 0.0617 49.18)` | Secondary button, badge bg |
| `--secondary-foreground` | `oklch(0.1895 0.0496 296.10)` | `oklch(0.7009 0.1501 48.02)` | Text on top of secondary bg |

```tsx
<button className="bg-secondary text-secondary-foreground">
  Learn more
</button>
```

---

### Accent (Teal/Cyan)

| Token | Light | Dark | Used For |
|-------|-------|------|---------------|
| `--accent` | `oklch(0.5416 0.0921 198.67)` | `oklch(0.2305 0.0617 49.18)` | Hover state, highlight, tag |
| `--accent-foreground` | `oklch(0.1895 0.0496 296.10)` | `oklch(0.6493 0.1496 47.92)` | Text on top of accent bg |

```tsx
// Hover state subtle
<div className="hover:bg-accent hover:text-accent-foreground">
```

---

### Border, Ring, Input

| Token | Light | Dark | Used For |
|-------|-------|------|---------------|
| `--border` | `oklch(0.8907 0.0302 85.57)` | `oklch(0.2497 0.0797 294.60)` | Border of all elements |
| `--input` | `oklch(0.9206 0.0202 84.59)` | `oklch(0.2201 0.0412 46.45)` | Input bg |
| `--ring` | `oklch(0.7204 0.1507 48.04)` | `oklch(0.7384 0.1747 49.22)` | Focus ring |

```tsx
// Border
<div className="border border-border">

// Focus ring — uses outline-ring/50 (applied globally)
<input className="focus-visible:ring-2 focus-visible:ring-ring" />
```

---

### Destructive (Error/Danger)

| Token | Light | Dark | Used For |
|-------|-------|------|---------------|
| `--destructive` | `oklch(0.7003 0.1792 22.10)` | `oklch(0.6489 0.1999 21.74)` | Error state, delete button |
| `--destructive-foreground` | `oklch(0.9801 0.0097 17.32)` | `oklch(0.9508 0.0198 25.17)` | Text on top of destructive bg |

```tsx
<button className="bg-destructive text-destructive-foreground">
  Delete
</button>
```

---

### Sidebar Tokens

Sidebar has its own tokens — separated so the sidebar can have a different color from the main content.

| Token | Used For |
|-------|---------------|
| `--sidebar` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Active nav item, sidebar CTA |
| `--sidebar-primary-foreground` | Text on top of sidebar-primary |
| `--sidebar-accent` | Hover state of nav item |
| `--sidebar-accent-foreground` | Text hover of nav item |
| `--sidebar-border` | Sidebar border/divider |
| `--sidebar-ring` | Focus ring in sidebar |

```tsx
<aside className="bg-sidebar border-r border-sidebar-border">
  <nav>
    <a className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
      Blocks
    </a>
    <a className="bg-sidebar-primary text-sidebar-primary-foreground">
      Active
    </a>
  </nav>
</aside>
```

---

### Chart Tokens

For data visualization — charts, graphs, progress bars.

| Token | Light | Dark |
|-------|-------|------|
| `--chart-1` | Orange (primary) | Green |
| `--chart-2` | Gold | Dark green |
| `--chart-3` | Teal | Darker green |
| `--chart-4` | Red/coral | Deep green |
| `--chart-5` | Dark orange | Deepest green |

```tsx
// Recharts or other chart library
<Bar fill="var(--chart-1)" />
<Line stroke="var(--chart-2)" />
```

---

## Typography Tokens

```css
--font-sans:  Plus Jakarta Sans, ui-sans-serif, sans-serif, system-ui;
--font-serif: Lora, ui-serif, serif;
--font-mono:  Space Mono, ui-monospace, monospace;
```

```tsx
<p className="font-sans">   // Plus Jakarta Sans — UI text
<p className="font-serif">  // Lora — prose/article
<code className="font-mono"> // Space Mono — code only
```

---

## Border Radius Tokens

Base radius `1.25rem` (20px) — very rounded, premium feel.

| Token | Value | Used For |
|-------|-------|---------------|
| `--radius-sm` | `calc(1.25rem - 4px)` = `0.9375rem` | Badge, tag, small chip |
| `--radius-md` | `calc(1.25rem - 2px)` = `1.0625rem` | Input, button |
| `--radius-lg` | `1.25rem` | Card, panel |
| `--radius-xl` | `calc(1.25rem + 4px)` = `1.5rem` | Modal, drawer, large card |

```tsx
<button className="rounded-md">      // button
<div className="rounded-lg">         // card
<div className="rounded-xl">         // modal
<span className="rounded-sm">        // badge
<div className="rounded-full">       // pill, avatar
```

---

## Shadow Tokens

Light mode: warm shadow `hsl(16.55 56.86% 10%)` — brownish
Dark mode: violet shadow `hsl(265.91 78.57% 10.98%)` — deep purple

| Token | Used For |
|-------|---------------|
| `--shadow-2xs` | Very subtle — inputs, dividers |
| `--shadow-xs` | Subtle — card hover |
| `--shadow-sm` | Default card |
| `--shadow` | Standard elevation |
| `--shadow-md` | Dropdown, popover |
| `--shadow-lg` | Dialog, modal |
| `--shadow-xl` | Large overlay |
| `--shadow-2xl` | Maximum elevation |

```tsx
<div className="shadow-sm">    // card
<div className="shadow-md">    // dropdown
<div className="shadow-lg">    // modal
```

---

## Spacing Token

```css
--spacing: 0.275rem;
```

Base spacing unit. Used for fine-tuned spacing not available in default Tailwind.

---

## Tailwind v4 Usage

All tokens are automatically available via `@theme inline` — use them directly as Tailwind classes:

```tsx
// Colors
bg-background       text-foreground
bg-card             text-card-foreground
bg-primary          text-primary-foreground
bg-secondary        text-secondary-foreground
bg-muted            text-muted-foreground
bg-accent           text-accent-foreground
bg-destructive      text-destructive-foreground
border-border
ring-ring

// Sidebar
bg-sidebar          text-sidebar-foreground
bg-sidebar-primary  text-sidebar-primary-foreground
bg-sidebar-accent   text-sidebar-accent-foreground
border-sidebar-border

// Radius
rounded-sm  rounded-md  rounded-lg  rounded-xl

// Shadow
shadow-2xs  shadow-xs  shadow-sm  shadow  shadow-md  shadow-lg  shadow-xl  shadow-2xl

// Typography
font-sans  font-serif  font-mono
```

---

## Dark Mode

Dark mode via `.dark` class on the root element:

```tsx
// _app.tsx or layout.tsx
<html className={isDark ? "dark" : ""}>
```

All tokens switch automatically — no `dark:` prefix is needed for token-based classes.

```tsx
// This changes automatically in dark mode
<div className="bg-background text-foreground border-border">

// dark: prefix is only for non-token classes
<div className="opacity-80 dark:opacity-60">
```

---

## Token Pairing — Quick Reference

### Page layout
```tsx
<body className="bg-background text-foreground">
<main className="bg-background">
<aside className="bg-sidebar border-r border-sidebar-border">
```

### Cards
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm">
```

### Buttons
```tsx
// Primary
<button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">

// Secondary
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md">

// Ghost
<button className="hover:bg-accent hover:text-accent-foreground rounded-md">

// Destructive
<button className="bg-destructive text-destructive-foreground rounded-md">
```

### Inputs
```tsx
<input className="bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring">
```

### Text hierarchy
```tsx
<h1 className="text-foreground font-bold">           // primary
<p className="text-foreground">                      // body
<p className="text-muted-foreground">                // secondary
<span className="text-primary">                      // accent/link
<span className="text-destructive">                  // error
```

### Popover / Dropdown
```tsx
<div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-md">
```

---

## Anti-patterns

```tsx
// Do not hardcode colors
<div className="bg-[#FF8C42]">           // incorrect
<div style={{ background: "#09090B" }}>  // incorrect

// Do not use oklch directly in classNames
<div className="bg-[oklch(0.72_0.15_48)]">  // incorrect

// Always use tokens
<div className="bg-primary">            // correct
<div className="bg-background">         // correct
```

---

## Checklist

- [ ] All colors use tokens (`bg-primary`, `text-foreground`, etc.)
- [ ] No hardcoded hex, oklch, or rgb in classNames
- [ ] Automatic dark mode via tokens — no `dark:bg-...` required for token-based classes
- [ ] Borders use `border-border`
- [ ] Focus rings use `ring-ring`
- [ ] Shadows use shadow tokens (`shadow-sm`, `shadow-md`, etc.)
- [ ] Border radius uses `rounded-sm/md/lg/xl` — no arbitrary radius
- [ ] Fonts use `font-sans`, `font-serif`, `font-mono`
