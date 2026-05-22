# Contributing to GwenUI

Thanks for showing up. GwenUI is a monorepo of copy-paste blocks, a docs site, and a CLI — every PR should make it easier for someone to ship a sharp landing page without fighting their stack.

---

## Local setup

**Requirements:** Node 22+, pnpm 10+ (Corepack recommended)

```bash
git clone https://github.com/JinXSuper/gwenui.git
cd gwenui
pnpm install
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for docs and block previews.

**CLI package (optional):**

```bash
cd packages/cli
pnpm build
pnpm link --global   # or: node dist/cli.js list
```

---

## Adding a new block

Blocks live under `blocks/<kebab-name>/` and are exported from `blocks/package.json`.

### 1. Scaffold the folder

```
blocks/my-block/
├── block.json          # registry metadata (required)
├── index.ts            # or index.tsx — public exports
├── MyBlock.tsx         # main component
├── README.md           # optional install notes
└── LICENSE             # MIT for basic/AI; copy BSL for supreme
```

### 2. `block.json`

```json
{
  "name": "my-block",
  "title": "My Block",
  "description": "One line for the registry.",
  "category": "hero",
  "license": "MIT",
  "tags": ["hero", "motion"],
  "dependencies": ["framer-motion"],
  "gwenui": {
    "theme": "gwen-noir",
    "type": "basic"
  }
}
```

Use `"type": "supreme"` and `"license": "BSL-1.1"` for R3F/WebGL blocks. Include a `LICENSE` file in the block folder.

### 3. Export from `blocks/package.json`

```json
"./my-block": "./my-block/index.ts"
```

### 4. Docs + preview

- Add MDX under `apps/web/src/content/docs/blocks/`
- Add a preview route under `apps/web/src/app/docs/blocks/` or `apps/web/src/app/preview/`
- Register in `apps/web/src/lib/blocks-registry.ts` and `apps/web/src/registry/registry.json` if applicable

### 5. Verify

```bash
cd apps/web && pnpm dev
# Open the block preview and docs page
```

---

## Code style

- **Tailwind v4** — utility-first; no stray inline styles unless necessary (R3F/canvas).
- **Colors** — use Gwen OKLCH CSS variables (`--primary`, `--background`, etc.). **No hardcoded hex/rgb** in components; tokens live in theme presets.
- **Motion** — prefer Framer Motion for 2D; respect `prefers-reduced-motion`.
- **Accessibility** — semantic HTML, focus states, alt text, keyboard nav on interactive blocks.
- **TypeScript** — strict types on public props; export prop types from the block index.

---

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(blocks): add comparison table variants
fix(cli): resolve registry fetch on Windows
docs: update supreme licensing section
chore: bump @gwenui/cli to 0.0.2
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

Scope examples: `blocks`, `cli`, `web`, `themes`, `supreme`

---

## Pull request checklist

- [ ] Block builds and renders in `apps/web` preview
- [ ] `block.json` license and `gwenui.type` are correct
- [ ] MIT blocks reference [LICENSE-MIT](./LICENSE-MIT); Supreme blocks include BSL `LICENSE`
- [ ] No hardcoded colors — OKLCH tokens only
- [ ] Docs MDX added or updated for user-facing changes
- [ ] Conventional commit title on the PR
- [ ] PR description explains *what* and *why* (screenshots/GIFs for UI)

---

## Questions

- **Discord:** `https://discord.gg/gwenui` *(placeholder — update when live)*
- **Issues:** [GitHub Issues](https://github.com/JinXSuper/gwenui/issues)

By contributing, you agree your work is licensed under the same terms as the files you touch (MIT for basic blocks, BSL 1.1 for Supreme/repo default where applicable).
