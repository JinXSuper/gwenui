export type BlockCategory = "Text Animations" | "Components" | "Hero Backgrounds" | "Visual Effects" | "Layout"

export type BlockType = "basic" | "supreme" | "ai"

export type Block = {
  id: string
  name: string
  description: string
  category: BlockCategory
  type: BlockType
  previewUrl: string
  docsUrl: string
  installCmd: string
}

export const BLOCKS: Block[] = [
  // --- Components ---
  {
    id: "auth-login",
    name: "Auth — Login",
    description: "Cinematic glassmorphic login screen with animated noise background.",
    category: "Components",
    type: "basic",
    previewUrl: "/preview/auth-login",
    docsUrl: "/docs/blocks/login",
    installCmd: "npx gwenui add auth-login",
  },
  {
    id: "dynamic-pricing",
    name: "Interactive Pricing Table",
    description: "Modern three-tier glass card pricing system with floating feature lists.",
    category: "Components",
    type: "basic",
    previewUrl: "/preview/dynamic-pricing",
    docsUrl: "/docs/blocks/dynamic-pricing",
    installCmd: "npx gwenui add dynamic-pricing",
  },
  {
    id: "testimonial-marquee",
    name: "Testimonial Marquee",
    description: "Infinite scrolling marquee of testimonial cards with pause-on-hover.",
    category: "Components",
    type: "basic",
    previewUrl: "/preview/testimonial-marquee",
    docsUrl: "/docs/blocks/testimonial-marquee",
    installCmd: "npx gwenui add testimonial-marquee",
  },
  {
    id: "ai-chat-hero",
    name: "AI Chat Hero",
    description: "Gemini-style streaming chat UI hero with animated responses.",
    category: "Components",
    type: "ai",
    previewUrl: "/preview/ai-chat-hero",
    docsUrl: "/docs/blocks/ai-chat-hero",
    installCmd: "npx gwenui add ai-chat-hero",
  },
  {
    id: "meet-the-team",
    name: "Meet the Team",
    description: "Hover-reveal team member cards with smooth animated overlays.",
    category: "Components",
    type: "basic",
    previewUrl: "/preview/meet-the-team",
    docsUrl: "/docs/blocks/meet-the-team",
    installCmd: "npx gwenui add meet-the-team",
  },
  {
    id: "before-after-slider",
    name: "Before After Slider",
    description: "Drag-to-reveal image comparison slider with spring physics.",
    category: "Components",
    type: "basic",
    previewUrl: "/preview/before-after-slider",
    docsUrl: "/docs/blocks/before-after-slider",
    installCmd: "npx gwenui add before-after-slider",
  },
  {
    id: "comparison-table",
    name: "Comparison Table",
    description: "Claude-style tiered pricing comparison table with highlighted recommended plan.",
    category: "Components",
    type: "basic",
    previewUrl: "/preview/comparison-table",
    docsUrl: "/docs/blocks/comparison-table",
    installCmd: "npx gwenui add comparison-table",
  },
  {
    id: "parallax-hero",
    name: "Supreme — Parallax Hero",
    description: "Ultra-premium, interactive 3D spring-physics parallax hero block with high-fidelity depth card stack.",
    category: "Components",
    type: "supreme",
    previewUrl: "/preview/parallax-hero",
    docsUrl: "/docs/blocks/parallax-hero",
    installCmd: "npx gwenui add parallax-hero",
  },

  // --- Layout ---
  {
    id: "bento-grid",
    name: "Bento Grid",
    description: "Asymmetric CSS grid with staggered entrance animations and hover depth effects. Ideal for SaaS feature showcases.",
    category: "Layout",
    type: "basic",
    previewUrl: "/preview/bento-grid",
    docsUrl: "/docs/blocks/bento-grid",
    installCmd: "npx gwenui add bento-grid",
  },
  {
    id: "feature-walkthrough",
    name: "Feature Walkthrough",
    description: "Scroll-driven step-by-step feature showcase with animated transitions.",
    category: "Layout",
    type: "basic",
    previewUrl: "/preview/feature-walkthrough",
    docsUrl: "/docs/blocks/feature-walkthrough",
    installCmd: "npx gwenui add feature-walkthrough",
  },
]
