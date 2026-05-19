import Link from "next/link";
import { PreviewToolbar } from "@/components/docs/preview-toolbar";
import { CodeSnippet } from "@/components/ui/CodeSnippet";
import { DocsSplitLayout } from "@/components/layout/DocsSplitLayout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPrevNext } from "@/components/docs/DocsPrevNext";
import { nav } from "../../nav";

const PAGE_PATHNAME = "/docs/supreme/parallax-hero";

const PARALLAX_HERO_CODE = `"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ParallaxImageLayer {
  src: string;
  depth: number; // Positive for foreground movement, negative for background movement
  xOffset: string; // Tailwind/CSS positioning (e.g. "left-[8%] top-[12%]")
  yOffset?: string;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  alt: string;
}

export const defaultLayers: ParallaxImageLayer[] = [
  {
    src: "/image/layer-1.webp",
    depth: 0.03,
    xOffset: "left-[8%] top-[12%]",
    width: 260,
    height: 380,
    rotation: -8,
    zIndex: 5,
    alt: "Floating Character Card Left Top"
  },
  {
    src: "/image/layer-2.webp",
    depth: -0.05,
    xOffset: "right-[12%] top-[15%]",
    width: 240,
    height: 360,
    rotation: 6,
    zIndex: 4,
    alt: "Floating Character Card Right Top"
  },
  {
    src: "/image/layer-3.webp",
    depth: 0.08,
    xOffset: "left-[5%] bottom-[10%]",
    width: 280,
    height: 400,
    rotation: -12,
    zIndex: 7,
    alt: "Floating Character Card Left Bottom"
  },
  {
    src: "/image/layer-4.webp",
    depth: -0.06,
    xOffset: "right-[8%] bottom-[12%]",
    width: 250,
    height: 370,
    rotation: 10,
    zIndex: 3,
    alt: "Floating Character Card Right Bottom"
  },
  {
    src: "/image/layer-5.webp",
    depth: 0.12,
    xOffset: "left-[45%] bottom-[8%]",
    width: 290,
    height: 420,
    rotation: 4,
    zIndex: 6,
    alt: "Floating Character Card Center Bottom"
  }
];

export interface ParallaxHeroProps {
  headline: string;
  description?: string;
  primaryCta: string;
  secondaryCta: string;
  bgText?: string;
  layers?: ParallaxImageLayer[];
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export function ParallaxHero({
  headline,
  description,
  primaryCta,
  secondaryCta,
  bgText = "GWEN",
  layers = defaultLayers,
  onPrimaryClick,
  onSecondaryClick,
  className
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 85, damping: 22, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const spotlightX = useTransform(smoothX, (v) => \`\${(v + 0.5) * 100}%\`);
  const spotlightY = useTransform(smoothY, (v) => \`\${(v + 0.5) * 100}%\`);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-slot="parallax-hero"
      className={cn(
        "relative w-full min-h-[90vh] md:min-h-screen bg-[#07050a] overflow-hidden flex flex-col items-center justify-center select-none font-sans px-4",
        className
      )}
    >
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060408]/90 to-[#030204] pointer-events-none z-0" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none overflow-hidden opacity-30 sm:opacity-40">
        <svg
          className="w-[120%] h-[120%] text-white/5"
          viewBox="0 0 1000 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <motion.radialGradient id="vectorSpotlight" cx={spotlightX} cy={spotlightY} r="35%">
              <stop offset="0%" stopColor="oklch(75% 0.18 48)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="oklch(45% 0.15 295)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </motion.radialGradient>
          </defs>
          
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            fill="none"
            stroke="url(#vectorSpotlight)"
            strokeWidth="0.8"
            className="font-serif text-[280px] tracking-widest font-black uppercase opacity-90 select-none"
            style={{
              fontFamily: "Lora, Georgia, serif",
              letterSpacing: "0.15em",
            }}
          >
            {bgText}
          </text>
        </svg>
      </div>

      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden select-none">
        {layers.map((layer, index) => {
          const x = useTransform(smoothX, (v) => v * layer.depth * 500);
          const y = useTransform(smoothY, (v) => v * layer.depth * 500);
          
          return (
            <motion.div
              key={index}
              style={{ x, y }}
              className={cn(
                "absolute hidden md:block transition-shadow duration-300",
                layer.xOffset
              )}
            >
              <div 
                className="relative overflow-hidden rounded-[var(--radius)] border border-white/10 bg-white/[0.02] backdrop-blur-[6px] transition-all duration-300 hover:border-primary/30"
                style={{
                  width: \`\${layer.width}px\`,
                  height: \`\${layer.height}px\`,
                  transform: \`rotate(\${layer.rotation || 0}deg)\`,
                  boxShadow: "var(--shadow-tier-3), 0 20px 45px rgba(0, 0, 0, 0.6)",
                  zIndex: layer.zIndex,
                }}
              >
                <img
                  src={layer.src}
                  alt={layer.alt}
                  className="w-full h-full object-cover pointer-events-none select-none opacity-85 hover:opacity-100 transition-opacity duration-300"
                  draggable={false}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative w-full max-w-3xl flex flex-col items-center justify-center text-center pointer-events-none z-10 py-16">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[150px] rounded-full bg-gradient-to-r from-orange-500/20 via-pink-500/10 to-teal-400/15 blur-[80px] sm:blur-[120px] pointer-events-none select-none opacity-70" />

        <h1 
          className="font-serif text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-medium tracking-tight text-white leading-[1.1] mb-6 select-none relative"
          style={{
            fontFamily: "Lora, Georgia, serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
            {headline}
          </span>
        </h1>

        {description && (
          <p className="font-sans text-[15px] sm:text-[17px] text-white/50 max-w-xl mb-10 leading-relaxed font-medium select-none px-4">
            {description}
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-4 pointer-events-auto select-none">
          <Button
            size="lg"
            variant="default"
            onClick={onPrimaryClick}
            className="font-semibold h-11 px-8 rounded-full bg-primary text-primary-foreground hover:opacity-95 transition-all active:scale-95"
          >
            {primaryCta}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onSecondaryClick}
            className="font-semibold h-11 px-8 rounded-full border border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-95"
          >
            {secondaryCta}
          </Button>
        </div>
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[12]"
        style={{
          background: "linear-gradient(to top, #07050a 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
`;

const USAGE_CODE = `import { ParallaxHero, defaultLayers } from "@/components/blocks/supreme/parallax-hero";

export default function Home() {
  return (
    <ParallaxHero
      headline="Build something extraordinary."
      description="GwenUI Supreme — where design meets dimension."
      primaryCta="Explore Blocks"
      secondaryCta="View Source"
      bgText="GWEN"
      layers={defaultLayers}
      onPrimaryClick={() => console.log("Primary clicked")}
      onSecondaryClick={() => console.log("Secondary clicked")}
    />
  );
}`;

export default function ParallaxHeroBlockPage() {
  // Static compile-time pagination resolution
  const allItems = nav.flatMap((g) => g.items);
  const currentIndex = allItems.findIndex((i) => i.href === PAGE_PATHNAME);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const prevItem = activeIndex > 0 ? allItems[activeIndex - 1] : null;
  const nextItem = activeIndex < allItems.length - 1 ? allItems[activeIndex + 1] : null;

  // Left Content: Documentation and Instructions
  const leftContent = (
    <div className="w-full flex flex-col flex-1 py-4">
      {/* Breadcrumb */}
      <DocsBreadcrumb />

      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider text-orange-500 bg-orange-500/10 border border-orange-500/20 uppercase">
          Supreme
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider text-purple-400 bg-purple-400/10 border border-purple-400/20 uppercase">
          Exclusive
        </span>
      </div>

      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[var(--docs-text-heading)]">
        Parallax Hero
      </h1>
      
      <p className="text-[15px] lg:text-[17px] text-[var(--docs-text-body)] leading-relaxed mb-12">
        An ultra-premium, interactive 3D spring-physics parallax hero block styled with a cinematic dark aesthetic, thinned spotlight vector hover backdrop, and a glowing gradient ambient shadow header. Built for high performance and visual excellence.
      </p>

      {/* Quick Add command snippet */}
      <CodeSnippet
        title="Installation"
        tabs={["npm", "pnpm", "yarn", "bun"].map((pm) => ({
          id: pm,
          icon: ">_",
          language: pm,
          code: `${pm} dlx @gwenui/cli add parallax-hero`,
        }))}
      />

      {/* Manual Installation Guidelines */}
      <CodeSnippet
        title="Setup Guides"
        tabs={[
          {
            id: "auto",
            language: "bash",
            code: "npx @gwenui/cli add parallax-hero",
            highlightedCode: (
              <div className="text-xs text-[var(--docs-text-body)] leading-[1.6]">
                <p className="mb-3 font-semibold text-[var(--docs-text-heading)]">Recommended Automatic Installation:</p>
                <p className="mb-4 text-[var(--docs-text-muted)]">Run the following CLI tool to automatically configure, inject, and wire all the required components, backgrounds, and assets into your project workspace:</p>
                <pre className="p-3 bg-[var(--docs-elem-surface)] border border-[var(--docs-border-faint)] rounded-lg font-mono text-orange-500 mb-2">npx @gwenui/cli add parallax-hero</pre>
              </div>
            )
          },
          {
            id: "manual",
            language: "tsx",
            code: USAGE_CODE,
            highlightedCode: (
              <div className="text-xs text-[var(--docs-text-body)] leading-[1.6]">
                <p className="mb-3 font-semibold text-[var(--docs-text-heading)]">Manual Step-by-Step Installation:</p>
                <ol className="list-decimal list-inside space-y-2 text-[var(--docs-text-muted)] mb-4">
                  <li>Create a new directory at <code className="text-[var(--docs-text-heading)] font-mono">components/blocks/supreme</code></li>
                  <li>Create a file named <code className="text-[var(--docs-text-heading)] font-mono">parallax-hero.tsx</code> and copy the source code from the Code tab on the right.</li>
                  <li>Save the WebP character asset layers to your <code className="text-[var(--docs-text-heading)] font-mono">public/image/</code> directory (labeled <code className="text-[var(--docs-text-heading)] font-mono">layer-1.webp</code> to <code className="text-[var(--docs-text-heading)] font-mono">layer-5.webp</code>).</li>
                  <li>Import the component and drop it onto your main landing page route.</li>
                </ol>
              </div>
            )
          }
        ]}
      />

      {/* Component Usage Code block */}
      <div className="mt-8 mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--docs-text-faint)] mb-4">Integration Example</h3>
        <CodeSnippet
          title="Home Page Usage"
          tabs={[
            {
              id: "usage",
              icon: "{}",
              language: "tsx",
              code: USAGE_CODE
            }
          ]}
        />
      </div>

      {/* Properties Props Table */}
      <div className="mb-12 mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--docs-text-faint)] mb-4">Properties & Props</h3>
        <div className="overflow-x-auto rounded-xl border border-[var(--docs-border-faint)] bg-black/20">
          <table className="w-full border-collapse font-sans text-xs text-left">
            <thead>
              <tr className="border-b border-[var(--docs-border-faint)] bg-[var(--docs-elem-surface)]/40 text-[var(--docs-text-heading)] font-semibold">
                <th className="p-4 font-mono font-bold">Prop</th>
                <th className="p-4 font-mono font-bold">Type</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--docs-border-faint)] text-[var(--docs-text-muted)]">
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">headline</td>
                <td className="p-4 font-mono text-orange-400">string</td>
                <td className="p-4 leading-relaxed">The main hero title (renders with Lora Serif and a glowing dynamic backlight shadow).</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">description</td>
                <td className="p-4 font-mono text-orange-400">string (Optional)</td>
                <td className="p-4 leading-relaxed">The description paragraph located under the title.</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">primaryCta</td>
                <td className="p-4 font-mono text-orange-400">string</td>
                <td className="p-4 leading-relaxed">The label text for the primary button.</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">secondaryCta</td>
                <td className="p-4 font-mono text-orange-400">string</td>
                <td className="p-4 leading-relaxed">The label text for the secondary outline button.</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">bgText</td>
                <td className="p-4 font-mono text-orange-400">string</td>
                <td className="p-4 leading-relaxed">The massive word rendered as the thinned SVG spotlight backdrop. Defaults to "GWEN".</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">layers</td>
                <td className="p-4 font-mono text-purple-400">ParallaxImageLayer[]</td>
                <td className="p-4 leading-relaxed">Configuration array specifying the source paths, depth coefficient, offset, dimensions, and rotation of the floating depth cards.</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">onPrimaryClick</td>
                <td className="p-4 font-mono text-purple-400">{"() => void"}</td>
                <td className="p-4 leading-relaxed">Click event handler for the primary CTA button.</td>
              </tr>
              <tr className="hover:bg-white/[0.01]">
                <td className="p-4 font-mono font-bold text-[var(--docs-text-heading)]">onSecondaryClick</td>
                <td className="p-4 font-mono text-purple-400">{"() => void"}</td>
                <td className="p-4 leading-relaxed">Click event handler for the secondary CTA button.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dependencies */}
      <div className="mb-10 mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--docs-text-faint)] mb-4">Required Dependencies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "framer-motion", purpose: "Elegant spring inertia & mouse math tracking" },
            { name: "clsx & tailwind-merge", purpose: "Tailwind CSS v4 class merging utilities" },
            { name: "@radix-ui/react-slot", purpose: "Radix Slot polymorphism base" },
            { name: "lucide-react", purpose: "Vector outline icons library" },
          ].map((dep) => (
            <div
              key={dep.name}
              className="p-3.5 rounded-xl border border-[var(--docs-border-faint)] bg-[var(--docs-elem-surface)]/20 hover:bg-[var(--docs-elem-hover)] transition-colors"
            >
              <div className="text-xs font-mono font-bold text-[var(--docs-text-heading)]">{dep.name}</div>
              <div className="text-[11px] text-[var(--docs-text-faint)] mt-1">{dep.purpose}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance & Quality Standards */}
      <div className="mb-12 mt-6 p-5 rounded-2xl border border-[var(--docs-border-faint)] bg-white/[0.01]">
        <h3 className="text-sm font-semibold text-[var(--docs-text-heading)] mb-2">💎 Performance & Quality Standards</h3>
        <ul className="list-disc list-inside space-y-2 text-xs text-[var(--docs-text-muted)] leading-relaxed">
          <li><strong>Zero Layout Shifts (CLS):</strong> Card image containers are pre-seeded with precise width and height bounds.</li>
          <li><strong>Highly Optimized Assets:</strong> Pruned from 6.43 MB to a mere 598 KB (a 90% space reduction) with WebP.</li>
          <li><strong>Strict Type-Safe:</strong> 100% written in TypeScript with strict compile parameters.</li>
          <li><strong>Font Harmony:</strong> Leverages Lora serif for editor/cinematic focus, and Plus Jakarta Sans for UI elements.</li>
        </ul>
      </div>

      {/* Pagination */}
      <DocsPrevNext />

      {/* Docs Footer */}
      <div className="w-full pt-8 pb-4 border-t border-[var(--docs-border-faint)] flex flex-col xl:flex-row items-center xl:justify-between gap-6 mt-auto">
        <div className="flex flex-wrap justify-center items-center gap-2 text-[11px] text-[var(--docs-text-faint)] font-medium tracking-wide">
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">Next.js 14+</span>
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">TypeScript</span>
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">Tailwind CSS v4</span>
          <span className="px-2 py-1 rounded bg-transparent border border-[var(--docs-border-faint)]">Framer Motion</span>
        </div>
        <div className="text-[12px] text-[var(--docs-text-dim)] text-center xl:text-right bg-transparent">
          Made by{" "}
          <a
            href="https://github.com/JinXSuper"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            JinXSuper
          </a>{" "}
          with Gwen <span className="text-orange-500/50">🧡</span>
        </div>
      </div>
    </div>
  );

  return (
    <DocsSplitLayout
      leftContent={leftContent}
      rightContent={
        <PreviewToolbar
          blockName="parallax-hero"
          iframeSrc="https://gwenui-hero-parallax.vercel.app"
          codeContent={PARALLAX_HERO_CODE}
        />
      }
      type="component"
    />
  );
}
