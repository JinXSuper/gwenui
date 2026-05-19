export type BlockCategory = "Text Animations" | "Components" | "Hero Backgrounds" | "Visual Effects"

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
    previewUrl: "https://gwenui-hyper-text.vercel.app",
    docsUrl: "/docs/blocks/hyper-text",
    installCmd: "npx @gwenui/cli add hyper-text",
  },
  {
    id: "text-animate",
    name: "Text Animate",
    description: "Animate text characters with staggered delays and premium easing effects.",
    category: "Text Animations",
    previewUrl: "https://gwenui-text-animate.vercel.app",
    docsUrl: "/docs/blocks/text-animate",
    installCmd: "npx @gwenui/cli add text-animate",
  },
  {
    id: "velocity-scroll",
    name: "Velocity Scroll",
    description: "Text that moves horizontally based on the current window scroll speed.",
    category: "Text Animations",
    previewUrl: "https://gwenui-velocity-scroll.vercel.app",
    docsUrl: "/docs/blocks/velocity-scroll",
    installCmd: "npx @gwenui/cli add velocity-scroll",
  },
  {
    id: "letter-cascade",
    name: "Letter Cascade",
    description: "Kinetic text animation where letters scatter outward with customizable spring physicals.",
    category: "Text Animations",
    previewUrl: "https://gwenui-letter-cascade.vercel.app",
    docsUrl: "/docs/blocks/letter-cascade",
    installCmd: "npx @gwenui/cli add letter-cascade",
  },
  {
    id: "text-repel",
    name: "Text Repel",
    description: "Physics-based text elements where each letter reacts dynamically to cursor proximity.",
    category: "Text Animations",
    previewUrl: "https://gwenui-text-repel.vercel.app",
    docsUrl: "/docs/blocks/text-repel",
    installCmd: "npx @gwenui/cli add text-repel",
  },
  {
    id: "particle-typography",
    name: "Particle Typography",
    description: "Renders dynamic typography constructed entirely from fluid, organic particle systems.",
    category: "Text Animations",
    previewUrl: "https://gwenui-particle-typography.vercel.app",
    docsUrl: "/docs/blocks/particle-typography",
    installCmd: "npx @gwenui/cli add particle-typography",
  },

  // --- Components ---
  {
    id: "login",
    name: "Auth — Login",
    description: "Cinematic glassmorphic login screen with animated noise background.",
    category: "Components",
    previewUrl: "https://gwen-ui-login.vercel.app/login",
    docsUrl: "/docs/blocks/login",
    installCmd: "npx @gwenui/cli add login",
  },
  {
    id: "pricing",
    name: "Interactive Pricing Table",
    description: "Modern three-tier glass card pricing system with floating feature lists.",
    category: "Components",
    previewUrl: "https://gwenui-pricing.vercel.app",
    docsUrl: "/docs/blocks/pricing",
    installCmd: "npx @gwenui/cli add pricing",
  },
  {
    id: "ai-chat",
    name: "AI Chat Interface",
    description: "Smooth streaming chat UI with liquid animations and markdown support.",
    category: "Components",
    previewUrl: "https://gwenui-chat.vercel.app",
    docsUrl: "/docs/blocks/ai-chat",
    installCmd: "npx @gwenui/cli add ai-chat",
  },
  {
    id: "parallax-hero",
    name: "Supreme — Parallax Hero",
    description: "Ultra-premium, interactive 3D spring-physics parallax hero block with high-fidelity depth card stack.",
    category: "Components",
    previewUrl: "https://gwenui-hero-parallax.vercel.app",
    docsUrl: "/docs/blocks/parallax-hero",
    installCmd: "npx @gwenui/cli add parallax-hero",
  },

  // --- Hero Backgrounds ---
  {
    id: "grainient",
    name: "Grainient Backdrop",
    description: "Animated grain texture overlay with customizable blend modes.",
    category: "Hero Backgrounds",
    previewUrl: "https://gwenui-grainient.vercel.app",
    docsUrl: "/docs/blocks/grainient",
    installCmd: "npx @gwenui/cli add grainient",
  },
  {
    id: "solaris",
    name: "Solaris Shader",
    description: "Premium dynamic WebGL fluid shader for landing page hero backdrops.",
    category: "Hero Backgrounds",
    previewUrl: "https://gwenui-solaris.vercel.app",
    docsUrl: "/docs/blocks/solaris",
    installCmd: "npx @gwenui/cli add solaris",
  },

  // --- Visual Effects ---
  {
    id: "magnetic-button",
    name: "Magnetic Button",
    description: "Smooth cursor-attracting button with chromatic aberration hover effects.",
    category: "Visual Effects",
    previewUrl: "https://gwenui-magnetic-button.vercel.app",
    docsUrl: "/docs/blocks/magnetic-button",
    installCmd: "npx @gwenui/cli add magnetic-button",
  },
  {
    id: "glass-surface",
    name: "Glass Surface",
    description: "High-performance glassmorphic container with custom shimmer highlights.",
    category: "Visual Effects",
    previewUrl: "https://gwenui-glass-surface.vercel.app",
    docsUrl: "/docs/blocks/glass-surface",
    installCmd: "npx @gwenui/cli add glass-surface",
  }
]
