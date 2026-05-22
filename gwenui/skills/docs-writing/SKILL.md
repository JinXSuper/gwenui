---
name: docs-writing
description: GwenUI documentation writing standards — MDX page structure, tone of voice, props table format, and CLI docs. Use when writing or editing GwenUI component docs, block docs, or CLI documentation.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Docs Writing SKILL

## Overview

Standard guide for writing GwenUI documentation — page structure, tone of voice,
and formatting for component docs, block docs, and CLI docs.

---

## Stack

- **Format:** MDX + custom React components
- **Language:** English only
- **Tone:** Casual but clear — similar to Linear or Vercel docs
- **Base structure:** shadcn/ui docs pattern (Props table, Usage, Examples)

---

## Tone of Voice

GwenUI docs are not stiff technical manuals. Write as if talking to a developer who understands — to the point, concise, yet still informative.

### Do
```
// Direct to the point
Install the block and drop it into your page.

// Use "you" instead of "the user"
You can customize the accent color via CSS variables.

// Short sentences
GwenUI uses OKLCH tokens. No hex, no hardcoded values.

// Active voice
Run the CLI to install dependencies.
```

### Don't
```
// Avoid passive voice
Dependencies will be installed by the CLI.

// Avoid being overly formal
The aforementioned component utilizes...

// Keep it short when possible
In order to be able to use this component, you will first need to...
→ To use this component, first...

// Do not over-explain the obvious
// Click the button to submit the form.
```

---

## Page Structure

### Component Docs Page

```mdx
---
title: Button
description: Triggers an action or event.
---

<BlockPreview block="button" height={200} />

## Installation

<Tabs>
  <Tab label="CLI">
    ```bash
    gwenui add button
    ```
  </Tab>
  <Tab label="Manual">
    Copy the component source into your project.
    [View source →](#)
  </Tab>
</Tabs>

## Usage

```tsx
import { Button } from "@/components/ui/button"

export default function Example() {
  return <Button variant="primary">Get started</Button>
}
```

## Variants

<BlockPreview block="button-variants" height={120} />

```tsx
<Button variant="primary">Primary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
```

## Props

<PropsTable
  props={[
    {
      name: "variant",
      type: '"primary" | "ghost" | "outline"',
      default: '"primary"',
      description: "Visual style of the button.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Size of the button.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables interaction.",
    },
    {
      name: "className",
      type: "string",
      default: "—",
      description: "Additional CSS classes.",
    },
  ]}
/>
```

---

### Block Docs Page

```mdx
---
title: AI Chat Hero
description: Gemini-inspired AI chat interface hero section.
category: hero
license: MIT
---

<BlockPreview block="ai-chat-hero" height={560} />

## Installation

```bash
gwenui add ai-chat-hero
```

## Usage

```tsx
import AIChatHero from "@/components/blocks/ai-chat-hero"

export default function Page() {
  return (
    <AIChatHero
      onSubmit={(value) => console.log(value)}
    />
  )
}
```

## Customization

The block uses GwenUI CSS variables. Override them in your stylesheet to customize colors.

```css
:root {
  --primary: oklch(68% 0.18 48);
  --bg: oklch(10% 0.005 265);
}
```

## Props

<PropsTable
  props={[
    {
      name: "headline",
      type: "string",
      default: '"What should we build today?"',
      description: "Main heading text.",
    },
    {
      name: "placeholder",
      type: "string",
      default: '"Ask Gwen..."',
      description: "Input placeholder text.",
    },
    {
      name: "onSubmit",
      type: "(value: string) => void",
      default: "—",
      description: "Called when user submits a message.",
    },
    {
      name: "className",
      type: "string",
      default: "—",
      description: "Additional CSS classes.",
    },
  ]}
/>

## Credits

Built by JinXSuper. MIT License.
```

---

### CLI Docs Page

```mdx
---
title: CLI
description: Install and manage GwenUI blocks from your terminal.
---

## Installation

```bash
npm install -g gwenui
```

## Commands

### `gwenui init`

Initialize GwenUI in your project. Creates a config file at `~/.gwen/config.json`
and installs core dependencies.

```bash
gwenui init
```

**Options**

| Flag | Description |
|------|-------------|
| `--force` | Overwrite existing config |
| `--supreme` | Include Supreme block dependencies (R3F, OGL, Three.js, Lenis) |

---

### `gwenui add <block>`

Add a block to your project.

```bash
gwenui add ai-chat-hero
gwenui add auth-login
```

**Options**

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview changes without writing files |
| `--path` | Custom output path (default: `components/blocks/`) |

---

### `gwenui view <block>`

Preview block details — version, dependencies, license.

```bash
gwenui view ai-chat-hero
```

---

### `gwenui diff <block>`

Show diff between your local block and the latest registry version.

```bash
gwenui diff ai-chat-hero
```

---

### `gwenui info`

Show current GwenUI config and installed blocks.

```bash
gwenui info
```

---

### `gwenui update <block>`

Update a block to the latest version.

```bash
gwenui update ai-chat-hero
gwenui update --all
```
```

---

## Custom MDX Components

React components available in all MDX files:

### `<BlockPreview />`
```tsx
// Render block live via iframe + Preview/Code tabs
<BlockPreview block="ai-chat-hero" height={560} />
```

### `<PropsTable />`
```tsx
// Render consistent props tables
<PropsTable
  props={[
    {
      name: "variant",
      type: '"primary" | "ghost"',
      default: '"primary"',
      description: "Visual style.",
    },
  ]}
/>
```

### `<Tabs />` + `<Tab />`
```tsx
// Multi-tab content (CLI vs Manual install)
<Tabs>
  <Tab label="CLI">...</Tab>
  <Tab label="Manual">...</Tab>
</Tabs>
```

### `<Callout />`
```tsx
// Info, warning, or tip callouts
<Callout type="info">
  This block requires Framer Motion.
</Callout>

<Callout type="warning">
  Supreme blocks require BSL 1.1 license compliance.
</Callout>
```

---

## Writing Rules

### Frontmatter — required on every page
```mdx
---
title: <Page Title>
description: <One sentence, no period at end>
---
```

Additional block page fields:
```mdx
---
title: AI Chat Hero
description: Gemini-inspired AI chat interface hero section
category: hero
license: MIT
---
```

### Headings
- No need to write H1 — automatically generated from the frontmatter `title`
- Start with H2 (`##`) for sections
- Maximum depth of H3 (`###`) for sub-sections — do not go deeper
- Headings must be action-oriented or noun phrases, not long sentences

```
## Installation     ✅
## How to Install   ✅
## Installing the component into your Next.js project   ❌
```

### Code blocks
- Always include a language identifier
- Use `tsx` for React/JSX, `ts` for TypeScript, `bash` for terminal
- File name can be added as a comment on the first line

```tsx
// components/blocks/ai-chat-hero/index.tsx
export default function AIChatHero() { ... }
```

### Props table rules
- `type` — use string unions with quotes: `"primary" | "ghost"`
- `default` — use `"—"` if there is no default value (not `undefined` or `null`)
- `description` — one short sentence, no period at the end
- Props order: most frequently used first, with `className` always at the very bottom

### Links
- Internal links: use relative paths `/docs/components/button`
- External links: always open in a new tab `[shadcn/ui →](https://ui.shadcn.com)`
- Do not link to resources that do not exist yet

---

## Checklist Before Done

- [ ] Complete frontmatter (`title`, `description`, `category`, `license` for blocks)
- [ ] `<BlockPreview />` present at the top before Installation
- [ ] Installation section present — CLI + Manual tabs
- [ ] Usage section present with a minimal example
- [ ] Complete props table — all props documented
- [ ] Casual but clear tone — no excessive passive voice
- [ ] Headings do not exceed H3
- [ ] All code blocks have a language identifier
- [ ] `className` prop placed at the bottom of the props table
- [ ] Default value is `"—"` instead of `undefined` or `null`
