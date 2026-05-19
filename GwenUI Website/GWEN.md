---
name: Gwen Code
description: >
  Generate UI components and pages using the GwenUI Design System — a dark-first,
  violet-dusk aesthetic with Gwen Orange as the primary accent, built on Tailwind v4,
  shadcn/ui, Radix UI, CVA, and Motion (motion/react).

  USE THIS SKILL every time the user asks to build any UI, component, page, layout,
  dashboard, form, or interface — even if they don't mention "GwenUI" explicitly.
  Triggers include: "bikin komponen", "buat UI", "bikin halaman", "buat dashboard",
  "bikin form", "create component", "build a page", "design a layout", and any
  similar request for frontend output.

  Before generating, read PERSONALITY.md for Gwen's tone & persona. Ask pre-coding
  questions if context is insufficient (skip if user already provided enough info).
---

# GwenUI Design System

GwenUI adalah design system solo milik Gwen. Dark-first, violet-dusk atmosphere,
dengan **Gwen Orange** (`oklch(75% 0.18 48)`) sebagai primary accent.

---

## Stack & Dependencies

- **Tailwind CSS v4** + `tw-animate-css`
- **shadcn/ui** sebagai base component
- **Radix UI** untuk primitives (Slot, Dialog, Popover, dll)
- **CVA** (`class-variance-authority`) untuk variant management
- **`cn`** dari `@/lib/utils` untuk className merging
- **Motion** (`motion/react`) untuk animasi — BUKAN `framer-motion`
- **Lucide React** untuk icons
- **Plus Jakarta Sans** (sans) · **Lora** (serif) · **Space Mono** (mono)

---

## Token Warna (CSS Variables)

### Default Theme — *Violet Dusk*
```
--background:        oklch(20% 0.05 295)
--foreground:        oklch(98.5% 0 0)
--card:              oklch(25% 0.08 295)
--card-foreground:   oklch(95% 0.01 295)
--primary:           oklch(75% 0.18 48)   /* Gwen Orange */
--primary-foreground oklch(15% 0.05 48)
--secondary:         oklch(30% 0.06 295)
--muted:             oklch(15% 0.05 295)
--muted-foreground:  oklch(70.8% 0 0)
--accent:            oklch(75% 0.18 48)
--border:            oklch(55% 0.22 300 / 20%)
--input:             oklch(55% 0.22 300 / 20%)
--ring:              oklch(75% 0.18 48 / 50%)
--glass-bg:          oklch(100% 0 0 / 3%)
--glass-blur:        12px
--radius:            0.625rem
```

### Dark Theme — *Gwen Noir*
Background lebih gelap (`oklch(12% 0.04 295)`), card `oklch(17% 0.06 295)`.
Semua token lain identik kecuali opacity border/input turun ke 15%.

### Sidebar
Selalu dark bahkan di light theme:
```
--sidebar:           oklch(25% 0.05 295)   /* default */  /  oklch(15% 0.05 295)  /* dark */
--sidebar-primary:   oklch(75% 0.18 48)
```

### Charts
Green family: `oklch(75%→45% 0.150 132.5)` untuk chart-1 sampai chart-5.

---

## Radius Scale
```
--radius-sm:  calc(var(--radius) - 4px)   /* ~0.25rem */
--radius-md:  calc(var(--radius) - 2px)   /* ~0.425rem */
--radius-lg:  var(--radius)               /* 0.625rem */
--radius-xl:  calc(var(--radius) + 4px)   /* ~1rem */
```

---

## Pola Komponen

### 1. Struktur Standar React Component

```tsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const componentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: { default: '...', ... },
      size: { default: '...', sm: '...', lg: '...' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

function MyComponent({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'element'> & VariantProps<typeof componentVariants>) {
  return (
    <element
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { MyComponent, componentVariants }
```

### 2. Animasi dengan Motion

Selalu pakai `motion/react`, BUKAN `framer-motion`:

```tsx
import { motion } from 'motion/react'

// Tap feedback (wajib di interactive elements)
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>

// Hover lift
<motion.div
  whileHover={{ y: -2 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>

// Fade-in masuk halaman
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

### 3. Glass Surface

```tsx
// Glass card
<div className="rounded-xl border border-border bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] p-6">

// Tailwind utility equivalent
className="bg-white/[0.03] backdrop-blur-[12px] border border-white/10 rounded-xl"
```

### 4. Slot / asChild Pattern

Pakai `@radix-ui/react-slot` untuk polymorphic components:

```tsx
import { Slot } from '@radix-ui/react-slot'

const Comp = asChild ? Slot : 'button'
return <Comp className={...} {...props}>{children}</Comp>
```

### 5. Button Props Standar

Selalu sertakan props ini di interactive components:
```tsx
{
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  loading?: boolean   // tampilkan <Loader2 className="animate-spin size-4" />
}
```

### 6. Loading State

```tsx
import { Loader2 } from 'lucide-react'

{loading ? <Loader2 className="animate-spin size-4" /> : leftIcon}
{children}
{!loading && rightIcon}
```

---

## Variants Standar

Setiap komponen interaktif biasanya punya variant berikut:

| Variant | Deskripsi |
|---|---|
| `default` / `primary` | `bg-primary text-primary-foreground` (Gwen Orange) |
| `secondary` | `bg-secondary text-secondary-foreground` |
| `outline` | Border + transparent bg, hover ke accent |
| `ghost` | Transparan, hover ke accent |
| `destructive` | `bg-destructive` merah |
| `link` | Underline, warna primary |

Size standar: `sm` (h-8), `default`/`md` (h-9), `lg` (h-10), plus `icon`, `icon-sm`, `icon-lg`.

---

## Aturan Desain

1. **Dark-first** — selalu desain untuk dark theme terlebih dahulu
2. **Gwen Orange** adalah satu-satunya accent warna — jangan tambah accent lain tanpa alasan kuat
3. **Violet undertone** di semua surface (hue 295 oklch)
4. **Motion** di semua elemen interaktif — minimal `whileTap`
5. **Glass morphism** untuk popover, modal, card yang mengambang
6. **Plus Jakarta Sans** untuk semua teks UI, Lora hanya untuk konten editorial
7. **`data-slot="..."` attribute** wajib di root element setiap komponen (`data-slot="button"`, `data-slot="card"`, dst)
8. Radius konsisten pakai `--radius` variables, bukan hardcode

---

## Sebelum Generate UI — Pre-Coding Questions

Tanya dalam **satu pesan rapi** jika info belum tersedia dari konteks. **Skip** yang sudah jelas.

1. **Target Utama** — Siapa target project ini?
2. **Visual Style** — GwenUI, Vercel-style, custom, atau bebas Gwen pilih?
3. **Typography** — Font apa? *(Default: Plus Jakarta Sans)*
4. **Ownership** — Nama pemilik project? *(Default: JinXSuper)*
5. **Theme** — Light, Dark, atau Toggle?

Sebelum generate, cari referensi inspirasi dari: **Aceternity, Magic UI, Origin UI, atau shadcn** — gabungkan dengan identitas GwenUI.

Untuk tone & cara bicara Gwen, baca `references/PERSONALITY.md`.

---

## Output Format

### Kapan pakai React/TSX:
- User minta "komponen", "component", ada konteks Next.js / React / Vite
- Output butuh state / interaktivitas kompleks
- Reusable component dengan variants

### Kapan pakai HTML + Tailwind:
- User minta "halaman", "page", "mockup", "preview"
- Konteks tidak ada framework spesifik
- Output untuk demo / artifact

Untuk HTML, embed CSS variables GwenUI di `<style>` tag dan gunakan Tailwind CDN.

---

## Checklist Sebelum Output

- [ ] Semua warna pakai CSS variables GwenUI, bukan hardcode hex/rgb
- [ ] Ada `motion/react` untuk elemen interaktif
- [ ] `data-slot` attribute di root element
- [ ] `cn()` untuk className merging
- [ ] `cva` untuk komponen dengan banyak variants
- [ ] Loading state kalau komponen bisa async
- [ ] Font: Plus Jakarta Sans di-import atau diasumsikan tersedia
- [ ] Dark theme bekerja tanpa perubahan (karena semua pakai CSS variables)
