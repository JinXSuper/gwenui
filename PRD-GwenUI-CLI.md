# Product Requirements Document (PRD): GwenUI CLI

## 1. Overview & Objectives

**Product:** `@gwenui/cli` (GwenUI CLI)
**Objective:** To build an interactive, high-performance command-line interface that allows developers to seamlessly integrate GwenUI blocks (both 2D and 3D Supreme blocks) directly into their Next.js projects as raw, customizable source code.
**Status:** The current CLI (in `packages/cli`) is a visual stub displaying "Coming Soon" built with Ink. However, the GwenUI documentation already promises a fully functional workflow. This PRD outlines the requirements to bridge this gap.

## 2. Discrepancy: Current State vs. Documentation

| Feature | Promised in Docs (`cli/*.mdx`) | Current Implementation (`packages/cli`) |
|---|---|---|
| **Tech Stack** | Ink (React-based terminal UI) | ✅ Ink is installed and configured |
| **Command: `init`** | `gwen-ui init` | ❌ Not implemented |
| **Command: `add`** | `gwen-ui add <block>` | ❌ Not implemented |
| **Config Resolution**| Reads `~/.gwen/config.json` | ❌ Not implemented |
| **Conflict Checks** | Checks for file conflicts in project | ⚠ Basic package conflict detection only |
| **Asset Injection** | Copies block source files & installs deps | ❌ Not implemented |

## 3. Installation Strategies

The CLI architecture must support the two installation paradigms explicitly promised in the GwenUI documentation (`/docs/cli/overview`):

### 3.1. Global Installation (Persistent)
Users can install the package globally across their system. The CLI must expose a reliable global bin alias (`gwen-ui`).
- **NPM:** `npm install -g @gwenui/cli`
- **PNPM:** `pnpm add -g @gwenui/cli`
- **Bun:** `bun add -g @gwenui/cli`
*(Execution: `gwen-ui <command>`)*

### 3.2. Direct Execution / Ephemeral
Users can execute the CLI directly without global installation, ensuring they always use the latest version. The CLI must be fully executable as an ephemeral package.
- **NPM:** `npx gwen-ui <command>`
- **PNPM:** `pnpm dlx gwen-ui <command>`
- **Bun:** `bunx gwen-ui <command>`

## 4. Core Requirements & Commands

### 4.1. Interactive Root Menu (`gwen-ui`)
If the user runs the command without arguments, the CLI should render an interactive Ink menu allowing them to:
- Initialize the project (`init`).
- Browse and select blocks to install (`add`).
- View current configuration.

### 4.2. Initialization (`gwen-ui init`)
- **Purpose:** Prepares a Next.js project to receive GwenUI blocks.
- **Actions:**
  1. Prompts the user for their preferred component directory (e.g., `src/components/blocks`).
  2. Prompts the user for their preferred styles directory (e.g., `src/styles` or `src/app`).
  3. Generates/updates the global config at `~/.gwen/config.json` (or a local `gwen.json` if project-specific scoping is implemented).
  4. Ensures `tailwind.config.ts` or `globals.css` is ready for GwenUI tokens.

### 4.3. Block Installation (`gwen-ui add <block>`)
- **Purpose:** Injects a specific block's source code into the user's project.
- **Workflow:**
  1. **Registry Fetch:** Resolves the `<block>` identifier (e.g., `auth-login`, `parallax-hero`) against a central registry or local manifest.
  2. **Config Read:** Reads `~/.gwen/config.json` to determine where to place the files (e.g., `src/components/blocks/login`).
  3. **Conflict Detection:** If a file already exists at the target path, prompt the user (Overwrite / Skip / Cancel).
  4. **File Copy:** Writes the `.tsx` components and any required `.css` or assets into the project.
  5. **Dependency Management:** Parses the block's required dependencies (e.g., `framer-motion`, `lucide-react`, `three`, `@react-three/fiber`) and automatically runs `npm/pnpm/yarn/bun install` for missing packages.
- **Success State:** Displays a success message with instructions on how to import the block.

## 4. Technical Architecture

- **Runtime:** Node.js (v18+)
- **UI Framework:** [Ink](https://github.com/vadimdemedes/ink) (React in the terminal).
- **Argument Parsing:** `meow` or `commander` combined with Ink to route commands (`init`, `add`) to their respective React components.
- **File System:** `fs-extra` for safe copying and JSON parsing.
- **Process Execution:** `execa` for running package manager install commands securely.
- **Registry:** A remote JSON manifest (e.g., hosted on the GwenUI website) that maps block IDs to their source code URLs and dependency lists.

## 5. Implementation Phases

**Phase 1: CLI Scaffolding & Config (Week 1)**
- Implement argument parsing (routing `init` and `add`).
- Implement the `init` interactive prompt using Ink (`ink-select-input`, `ink-text-input`).
- Write read/write logic for `~/.gwen/config.json`.

**Phase 2: The Registry & Fetching (Week 2)**
- Define the JSON schema for a "Block Payload" (files, dependencies, tags).
- Implement fetching logic to retrieve block payloads from the GwenUI repository.

**Phase 3: The `add` Command & Dependencies (Week 3)**
- Implement the `add` workflow: File writing + Conflict resolution UI.
- Implement AST parsing or manifest reading to dynamically install NPM packages.
- Add polished loading spinners (`ink-spinner`) and success messages.

## 6. Success Metrics
- A user can run `npx gwen-ui init` and `npx gwen-ui add auth-login` in a fresh Next.js project and have a working block in under 15 seconds.
- Zero manual copy-pasting required for standard blocks.
- **Design System Consistency:** The Ink CLI UI must not use hardcoded hex colors (e.g., `#FF8C42`). Instead, it must dynamically match or closely emulate the exact OKLCH values defined in the GwenUI `globals.css` (e.g., matching the `--primary` and `--background` tokens) to ensure a perfectly seamless "Gwen Noir" aesthetic.
