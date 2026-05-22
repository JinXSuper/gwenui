export const nav = [
  {
    group: "GETTING STARTED",
    items: [
      { label: "Introduction", href: "/docs/getting-started/introduction" },
      { label: "Installation", href: "/docs/getting-started/installation" },
      { label: "Quick Start", href: "/docs/getting-started/quick-start" },
      { label: "Skills", href: "/docs/getting-started/skills" },
      { label: "LLMs", href: "/llms.txt", external: true },
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
      { label: "AI Chat Hero", href: "/docs/blocks/ai-chat-hero" },
      { label: "Testimonial Marquee", href: "/docs/blocks/testimonial-marquee" },
      { label: "Dynamic Pricing", href: "/docs/blocks/dynamic-pricing" },
      { label: "Comparison Table", href: "/docs/blocks/comparison-table" },
      { label: "Feature Walkthrough", href: "/docs/blocks/feature-walkthrough" },
      { label: "Meet the Team", href: "/docs/blocks/meet-the-team" },
      { label: "Before-After Slider", href: "/docs/blocks/before-after-slider" },
      { label: "Bento Grid", href: "/docs/blocks/bento-grid" },
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
    ],
  },
];

export const allItems = nav.flatMap((g) => g.items);
