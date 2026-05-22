export type BlockCategory = "Text Animations" | "Components" | "Hero Backgrounds" | "Visual Effects" | "Layout"

export type Block = {
  id: string
  name: string
  description: string
  category: BlockCategory
  previewUrl: string
  docsUrl: string
  installCmd: string
}

export const BLOCKS: Block[] = [
  // --- Text Animations ---
  {
    id: "hyper-text",
    name: "Hyper Text",
    description: "A text scramble effect that cycles through characters before revealing the final text.",
    category: "Text Animations",
    previewUrl: "/preview/hyper-text",
    docsUrl: "/docs/blocks/hyper-text",
    installCmd: "npx @gwenui/cli add hyper-text",
  },
  {
    id: "text-animate",
    name: "Text Animate",
    description: "Animate text characters with staggered delays and premium easing effects.",
    category: "Text Animations",
    previewUrl: "/preview/text-animate",
    docsUrl: "/docs/blocks/text-animate",
    installCmd: "npx @gwenui/cli add text-animate",
  },
  {
    id: "velocity-scroll",
    name: "Velocity Scroll",
    description: "Text that moves horizontally based on the current window scroll speed.",
    category: "Text Animations",
    previewUrl: "/preview/velocity-scroll",
    docsUrl: "/docs/blocks/velocity-scroll",
    installCmd: "npx @gwenui/cli add velocity-scroll",
  },
  {
    id: "letter-cascade",
    name: "Letter Cascade",
    description: "Kinetic text animation where letters scatter outward with customizable spring physicals.",
    category: "Text Animations",
    previewUrl: "/preview/letter-cascade",
    docsUrl: "/docs/blocks/letter-cascade",
    installCmd: "npx @gwenui/cli add letter-cascade",
  },
  {
    id: "text-repel",
    name: "Text Repel",
    description: "Physics-based text elements where each letter reacts dynamically to cursor proximity.",
    category: "Text Animations",
    previewUrl: "/preview/text-repel",
    docsUrl: "/docs/blocks/text-repel",
    installCmd: "npx @gwenui/cli add text-repel",
  },
  {
    id: "particle-typography",
    name: "Particle Typography",
    description: "Renders dynamic typography constructed entirely from fluid, organic particle systems.",
    category: "Text Animations",
    previewUrl: "/preview/particle-typography",
    docsUrl: "/docs/blocks/particle-typography",
    installCmd: "npx @gwenui/cli add particle-typography",
  },

  // --- Components ---
  {
    id: "login",
    name: "Auth — Login",
    description: "Cinematic glassmorphic login screen with animated noise background.",
    category: "Components",
    previewUrl: "/preview/login",
    docsUrl: "/docs/blocks/login",
    installCmd: "npx @gwenui/cli add login",
  },
  {
    id: "pricing",
    name: "Interactive Pricing Table",
    description: "Modern three-tier glass card pricing system with floating feature lists.",
    category: "Components",
    previewUrl: "/preview/pricing",
    docsUrl: "/docs/blocks/pricing",
    installCmd: "npx @gwenui/cli add pricing",
  },
  {
    id: "ai-chat",
    name: "AI Chat Interface",
    description: "Smooth streaming chat UI with liquid animations and markdown support.",
    category: "Components",
    previewUrl: "/preview/ai-chat",
    docsUrl: "/docs/blocks/ai-chat",
    installCmd: "npx @gwenui/cli add ai-chat",
  },
  {
    id: "parallax-hero",
    name: "Supreme — Parallax Hero",
    description: "Ultra-premium, interactive 3D spring-physics parallax hero block with high-fidelity depth card stack.",
    category: "Components",
    previewUrl: "/preview/parallax-hero",
    docsUrl: "/docs/blocks/parallax-hero",
    installCmd: "npx @gwenui/cli add parallax-hero",
  },

  // --- Hero Backgrounds ---
  {
    id: "grainient",
    name: "Grainient Backdrop",
    description: "Animated grain texture overlay with customizable blend modes.",
    category: "Hero Backgrounds",
    previewUrl: "/preview/grainient",
    docsUrl: "/docs/blocks/grainient",
    installCmd: "npx @gwenui/cli add grainient",
  },
  {
    id: "solaris",
    name: "Solaris Shader",
    description: "Premium dynamic WebGL fluid shader for landing page hero backdrops.",
    category: "Hero Backgrounds",
    previewUrl: "/preview/solaris",
    docsUrl: "/docs/blocks/solaris",
    installCmd: "npx @gwenui/cli add solaris",
  },

  // --- Layout ---
  {
    id: "bento-grid",
    name: "Bento Grid",
    description: "Asymmetric CSS grid with staggered entrance animations and hover depth effects. Ideal for SaaS feature showcases.",
    category: "Layout",
    previewUrl: "/preview/bento-grid",
    docsUrl: "/docs/blocks/bento-grid",
    installCmd: "npx @gwenui/cli add bento-grid",
  },

  // --- Visual Effects ---
  {
    id: "magnetic-button",
    name: "Magnetic Button",
    description: "Smooth cursor-attracting button with chromatic aberration hover effects.",
    category: "Visual Effects",
    previewUrl: "/preview/magnetic-button",
    docsUrl: "/docs/blocks/magnetic-button",
    installCmd: "npx @gwenui/cli add magnetic-button",
  },
  {
    id: "glass-surface",
    name: "Glass Surface",
    description: "High-performance glassmorphic container with custom shimmer highlights.",
    category: "Visual Effects",
    previewUrl: "/preview/glass-surface",
    docsUrl: "/docs/blocks/glass-surface",
    installCmd: "npx @gwenui/cli add glass-surface",
  }
]
