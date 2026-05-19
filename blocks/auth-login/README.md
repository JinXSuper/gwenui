<div align="center">

<br />

# ✦ GwenUI Login

**The login page that makes people stop scrolling.**

Glassmorphism · Grainient · GwenUI Design System · Next.js

<br />

[![Live Preview](https://img.shields.io/badge/Live%20Preview-Open%20App-orange?style=for-the-badge&logo=vercel&logoColor=white)](#)
[![Built by](https://img.shields.io/badge/Built%20by-JinXSuper-blueviolet?style=for-the-badge)](#)
[![Design](https://img.shields.io/badge/Design%20System-GwenUI-ff8c42?style=for-the-badge)](#)

<br />

![Login Preview](/public/preview.png)

> *"Welcome back."* — Two words. One stunning page.

</div>

---

## ✦ What is this?

This isn't just a login page. It's a **statement**.

A split-panel authentication experience built on the **GwenUI Design System** — dark violet surfaces, a signature orange accent, and a custom **Grainient** effect that makes the right panel feel like it's alive. The kind of login page that makes your users think *"okay, this product is serious."*

Every pixel is intentional. Nothing is default.

---

## ✦ The Grainient

The star of the show. `Grainient` is a custom effect combining:

- **Gradient** — A sweeping orange-to-violet color field
- **Grain texture** — Fine CSS noise overlay for that premium, tactile feel
- Rendered purely in CSS — zero image assets, zero performance hit

```tsx
// Drop it anywhere
import { Grainient } from "@/components/Grainient"

<Grainient className="rounded-3xl" />
```

The grain reacts to the gradient underneath, giving the panel
a depth that flat colors simply can't achieve.

---

## ✦ Design Tokens

Powered by the **GwenUI Design System** in OKLCH color space:

```css
/* Gwen Noir — Dark Mode */
--primary:    oklch(75% 0.18 48);     /* Gwen Orange — the hero  */
--background: oklch(20% 0.05 295);    /* Deep Violet — the stage */
--card:       oklch(25% 0.08 295);    /* Glass surface           */
--border:     oklch(55% 0.22 300 / 20%);
```

**Typography:** Plus Jakarta Sans — clean, modern, trustworthy.

**Radius:** `1.5rem` — soft and deliberate, never generic.

**Shadow:** `0px 19px 30px #0a051466` — floats the card off the page.

---

## ✦ Features

- **Split-panel layout** — Form on the left, Grainient art on the right
- **Glass card** — Backdrop blur + subtle border for depth
- **Social auth buttons** — Apple · Google · Meta
- **Forgot password flow** — Inline, no page jump
- **Fully responsive** — Panel collapses gracefully on mobile
- **Dark by default** — Gwen Noir theme, no apologies

---

## ✦ Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + CSS Variables |
| Components | shadcn/ui (custom themed) |
| Effect | Grainient.tsx + Grainient.css |
| Theme | next-themes (Gwen Noir default) |
| Deployment | Vercel |

---

## ✦ Project Structure

```
├── app/
│   └── login/
│       ├── favicon.ico
│       ├── globals.css          # GwenUI token definitions
│       ├── layout.tsx           # Root layout + ThemeProvider
│       └── page.tsx             # Login route entry
├── components/
│   ├── ui/                      # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── field.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── separator.tsx
│   ├── Grainient.css            # Grain texture + gradient styles
│   ├── Grainient.tsx            # The signature panel effect ✦
│   ├── login-form.tsx           # Auth form with social buttons
│   └── theme-provider.tsx       # next-themes provider
├── hooks/
│   └── (mobile utilities)
├── lib/
│   └── utils.ts                 # cn() + shared helpers
├── public/
├── components.json              # shadcn/ui config
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## ✦ Getting Started

```bash
# Clone the repo
git clone https://github.com/jinxsuper/gwen-ui-login.git
cd gwen-ui-login

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000/login](http://localhost:3000/login) and enjoy the vibe.

### Adding shadcn components

```bash
npx shadcn@latest add [component-name]
```

Components land in `components/ui/` already styled with GwenUI tokens.

---

## ✦ Customization

### Swap the Grainient colors

Open `Grainient.css` and update the gradient stops. The grain layer
sits on top automatically — the texture adapts to whatever palette you use.

### Switch themes

```tsx
// globals.css — change the active :root block
// violet-dusk  → dark violet + orange (default light)
// gwen-noir    → .dark class (current — dark by default)
```

---

## ✦ License

MIT © [JinXSuper](https://github.com/JinXSuper)

---

<div align="center">

<br />

Designed with 🧡 by **JinXSuper** · Powered by **GwenUI**

*"The best login page you've ever seen."*

<br />

</div>