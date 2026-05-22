# GwenUI

[![version](https://img.shields.io/badge/version-0.4.1-orange)](https://github.com/JinXSuper/gwenui/releases)
[![license](https://img.shields.io/badge/license-BSL%201.1-blue)](./LICENSE)
[![npm](https://img.shields.io/npm/dm/@gwenui/cli?label=npm%20downloads)](https://www.npmjs.com/package/@gwenui/cli)
[![stars](https://img.shields.io/github/stars/JinXSuper/gwenui?style=social)](https://github.com/JinXSuper/gwenui)

**Ship fast. Stay precise.**

High-performance React blocks for developers who hate reinventing the wheel. Open-source, accessible, and battle-tested — copy into your repo, own the code, ship the landing page tonight.

**[Documentation](https://gwenui.vercel.app/docs)** · **[Live blocks](https://gwenui.vercel.app)** · **[Contributing](./CONTRIBUTING.md)**

---

## Quick start

```bash
npx gwenui init
npx gwenui add parallax-hero
```

`init` wires GwenUI tokens, `components.json`, and your registry. `add` copies the block (and deps) into your project — no black-box `node_modules` UI.

```tsx
import { ParallaxHero } from "@/components/blocks/parallax-hero"

export default function Page() {
  return <ParallaxHero />
}
```

---

## Block types

| Type | Stack | License | What you get |
|------|--------|---------|----------------|
| **Basic** | React, Tailwind v4, Framer Motion, shadcn/ui | [MIT](./LICENSE-MIT) | Production-ready 2D sections — pricing, teams, marquees, grids. Drop in, theme with OKLCH tokens. |
| **Supreme** | React Three Fiber, WebGL, advanced motion | [BSL 1.1](./LICENSE) | Cinematic 3D heroes and effects. Free for most apps; commercial use has restrictions — see [Supreme docs](https://gwenui.vercel.app/docs/packages/supreme). |
| **AI** | LLM-ready layouts, chat UIs, prompt surfaces | MIT (blocks) | Blocks built for AI products — chat heroes, suggestion chips, streaming-friendly layouts. |

### Blocks in this release

| Block | Type |
|-------|------|
| Parallax Hero | Supreme |
| Testimonial Marquee | Basic |
| Dynamic Pricing | Basic |
| Meet the Team | Basic |
| Before-After Slider | Basic |
| AI Chat Hero | AI |
| Bento Grid | Basic |
| Feature Walkthrough | Basic |
| Comparison Table | Basic |

---

## Packages

| Package | Description |
|---------|-------------|
| [`@gwenui/react`](https://gwenui.vercel.app/docs/packages/react) | 2D blocks — shadcn/ui + Gwen tokens + Framer Motion |
| [`@gwenui/supreme`](https://gwenui.vercel.app/docs/packages/supreme) | R3F / WebGL blocks (BSL 1.1) |
| [`@gwenui/themes`](https://gwenui.vercel.app/docs/packages/themes) | OKLCH theme presets (`gwen-noir`, etc.) |
| [`@gwenui/cli`](https://gwenui.vercel.app/docs/packages/cli) | Registry CLI — `gwenui` bin, `init` / `add` / `diff` |

Blocks are installed via CLI into **your** codebase, not consumed as opaque npm UI.

---

## Monorepo

```
apps/web          # Docs site + block previews (Next.js)
blocks/           # Block source (single source of truth)
packages/cli      # @gwenui/cli
gwenui/skills     # Agent skills for Gwen patterns
```

**Stack:** Next.js · React 19 · Tailwind CSS v4 · shadcn/ui · Framer Motion · React Three Fiber  
**Tooling:** pnpm workspaces · Turborepo · Node 22+

```bash
pnpm install
cd apps/web && pnpm dev
```

---

## License

| Scope | License |
|-------|---------|
| Repo (default) | [BSL 1.1](./LICENSE) |
| Basic blocks (`blocks/*` except Supreme) | [MIT](./LICENSE-MIT) — see per-block `block.json` |
| Supreme blocks (e.g. `parallax-hero`) | [BSL 1.1](./LICENSE) |

Supreme blocks convert to Apache 2.0 on the Change Date defined in `LICENSE`. Read the license before redistributing or offering blocks as a hosted library.

---

## Links

- **Website:** https://gwenui.vercel.app
- **Docs:** https://gwenui.vercel.app/docs
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md)
- **Security:** [SECURITY.md](./SECURITY.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

<p align="center">Made by <a href="https://github.com/JinXSuper">JinXSuper</a> with Gwen ♥</p>
