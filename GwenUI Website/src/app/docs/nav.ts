export const nav = [
  {
    group: "GETTING STARTED",
    items: [
      { label: "Introduction", href: "/docs/getting-started/introduction" },
      { label: "Installation", href: "/docs/getting-started/installation" },
      { label: "Quick Start", href: "/docs/getting-started/quick-start" },
    ],
  },
  {
    group: "CLI",
    items: [
      { label: "Overview", href: "/docs/cli/overview" },
      { label: "init", href: "/docs/cli/init" },
      { label: "add", href: "/docs/cli/add" },
      { label: "Global Config", href: "/docs/cli/global-config" },
    ],
  },
  {
    group: "THEMING",
    items: [
      { label: "Design Tokens", href: "/docs/theming/design-tokens" },
      { label: "OKLCH Colors", href: "/docs/theming/oklch-colors" },
      { label: "Custom Fonts", href: "/docs/theming/custom-fonts" },
    ],
  },
  {
    group: "BLOCKS",
    items: [
      { label: "Overview", href: "/docs/blocks/overview" },
      { label: "Auth — Login", href: "/docs/blocks/login" },
    ],
  },
  {
    group: "PACKAGES",
    items: [
      { label: "@gwenui/themes", href: "/docs/packages/themes" },
      { label: "@gwenui/react", href: "/docs/packages/react" },
      { label: "@gwenui/cli", href: "/docs/packages/cli" },
      { label: "@gwenui/supreme", href: "/docs/packages/supreme" },
    ],
  },
  {
    group: "SUPREME",
    badge: "Exclusive",
    items: [
      { label: "Overview", href: "/docs/supreme/overview" },
      { label: "Parallax Hero", href: "/docs/supreme/parallax-hero" },
      { label: "Command Menu", href: "/docs/supreme/command-menu" },
      { label: "Data Table", href: "/docs/supreme/data-table" },
    ],
  },
];

export const allItems = nav.flatMap((g) => g.items);
