import { Search, Terminal, Sliders, LayoutTemplate, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SmartCodeBlock } from '@/components/docs/SmartCodeBlock';

export default function BlocksOverviewPage() {
  return (
    <article className="w-full relative pb-20">
      {/* SECTION 1 — Hero Block */}
      <section className="relative mt-8 mb-16 pt-8 pb-12">
        {/* Animated Glow Behind Hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-full max-w-[800px] pointer-events-none -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        </div>

        <div className="flex flex-col items-start gap-4">
          <h1 className="font-serif font-bold text-5xl tracking-tight text-[var(--foreground)]">
            Blocks
          </h1>
          <h2 className="text-xl text-[var(--muted-foreground)] max-w-2xl font-medium">
            Full-page sections, ready to drop into your Next.js project.
          </h2>

          <p className="text-[var(--muted-foreground)]/80 max-w-3xl leading-relaxed mt-2 text-sm md:text-base">
            GwenUI Blocks are complete, full-page UI sections — not atomic components. Each block is a self-contained layout you can install via the CLI and customize to fit your product. Built with Tailwind, shadcn/ui, and Framer Motion.
          </p>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--muted)]/50 text-[var(--muted-foreground)] border border-[var(--border)]">
              Basic
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-[0_0_10px_var(--primary)]/20">
              Supreme
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2 — How It Works (3-step flow) */}
      <section className="mb-20">
        <h3 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
          How Blocks Work
        </h3>
        <div className="relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-[var(--border)] z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center md:items-start bg-[var(--docs-page-bg)] px-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold ring-4 ring-[var(--docs-page-bg)]">
                  1
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shadow-sm">
                  <Search size={18} />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-[var(--foreground)] text-center md:text-left mb-2">Browse</h4>
              <p className="text-sm text-[var(--muted-foreground)] text-center md:text-left leading-relaxed">
                Find the block you need from the library.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center md:items-start bg-[var(--docs-page-bg)] px-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold ring-4 ring-[var(--docs-page-bg)]">
                  2
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shadow-sm">
                  <Terminal size={18} />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-[var(--foreground)] text-center md:text-left mb-2">Install</h4>
              <p className="text-sm text-[var(--muted-foreground)] text-center md:text-left leading-relaxed">
                Run one CLI command to add it to your project.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center md:items-start bg-[var(--docs-page-bg)] px-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold ring-4 ring-[var(--docs-page-bg)]">
                  3
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shadow-sm">
                  <Sliders size={18} />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-[var(--foreground)] text-center md:text-left mb-2">Customize</h4>
              <p className="text-sm text-[var(--muted-foreground)] text-center md:text-left leading-relaxed">
                Tweak tokens, content, and layout to match your brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Block Categories */}
      <section className="mb-20">
        <h3 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-6 border-b border-[var(--border)] pb-4">
          Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 — Basic Blocks */}
          <div className="flex flex-col p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 hover:bg-[var(--card)] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] flex items-center justify-center text-[var(--foreground)]">
                <LayoutTemplate size={20} />
              </div>
              <h4 className="text-xl font-semibold text-[var(--foreground)]">Basic</h4>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-6 flex-grow leading-relaxed">
              2D full-page sections built with Tailwind + Framer Motion. Fast, accessible, and easy to customize.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">tailwind</span>
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">framer-motion</span>
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">shadcn</span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]/50">
              <span className="text-xs font-medium text-[var(--muted-foreground)]">
                1 block available
              </span>
              <Link 
                href="/docs/blocks/login"
                className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors group flex items-center gap-1"
              >
                Browse Basic <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Card 2 — Supreme Blocks */}
          <div className="flex flex-col p-6 rounded-2xl border border-[var(--primary)]/30 bg-[var(--card)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[var(--docs-elem-surface)] backdrop-blur-[12px] z-0" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="text-xl font-semibold text-[var(--foreground)]">Supreme</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/20">
                  Exclusive
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-6 flex-grow leading-relaxed">
                WebGL-powered full-page blocks using R3F and OGL. For products that demand cinematic visual quality.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-1 bg-[var(--muted)]/30 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/30">r3f</span>
                <span className="px-2 py-1 bg-[var(--muted)]/30 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/30">ogl</span>
                <span className="px-2 py-1 bg-[var(--muted)]/30 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/30">glsl</span>
                <span className="px-2 py-1 bg-[var(--muted)]/30 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/30">framer-motion</span>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)]/30">
                <span className="text-xs font-medium text-[var(--muted-foreground)]">
                  1 block available
                </span>
                <Link 
                  href="/docs/supreme/overview"
                  className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors group flex items-center gap-1"
                >
                  Explore Supreme <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3.5 — Interactive File Architecture showcasing the Virtual IDE */}
      <section className="mb-20">
        <h3 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-6 border-b border-[var(--border)] pb-4">
          Multi-File Block Architecture
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed">
          Unlike ordinary copy-paste snippets that result in massive monolithic components, GwenUI structures blocks as clean, modular directories. Tap on the file explorer below to inspect the files layout inside our flagship auth-login component:
        </p>
        <SmartCodeBlock
          title="auth-login workspace layout"
          files={[
            {
              name: "index.tsx",
              path: "auth-login/index.tsx",
              content: `import React from 'react';\nimport { LoginForm } from './login-form';\n\nexport default function Page() {\n  return <LoginForm />;\n}`,
              language: "tsx"
            },
            {
              name: "login-form.tsx",
              path: "auth-login/login-form.tsx",
              content: `import React from 'react';\nimport { Card } from './ui/card';\nimport { Button } from './ui/button';\n\nexport function LoginForm() {\n  return (\n    <Card className="p-6 max-w-sm">\n      <h2 className="text-xl font-bold mb-4">Login</h2>\n      <input type="email" placeholder="Email Address" className="mb-3 w-full p-2 border rounded" />\n      <Button className="w-full bg-orange-600 hover:bg-orange-500 py-3">Sign In</Button>\n    </Card>\n  );\n}`,
              language: "tsx"
            },
            {
              name: "card.tsx",
              path: "auth-login/ui/card.tsx",
              content: `import React from 'react';\n\nexport function Card({ children, className }: any) {\n  return (\n    <div className={\`rounded-lg border bg-card text-card-foreground shadow-sm p-4 \${className}\`}>\n      {children}\n    </div>\n  );\n}`,
              language: "tsx"
            }
          ]}
        />
      </section>

      {/* SECTION 4 — Available Blocks Preview */}
      <section className="mb-16">
        <h3 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-6 border-b border-[var(--border)] pb-4">
          Available Blocks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 — Auth — Login */}
          <div className="flex flex-col p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 hover:bg-[var(--card)] hover:border-[var(--border)]/80 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-[var(--foreground)]">Auth — Login</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--muted)]/50 text-[var(--muted-foreground)] border border-[var(--border)]/50">
                Basic
              </span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-6 flex-grow">
              A clean, full-page authentication layout with email/password form, social login slots, and subtle animation.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">framer-motion</span>
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">shadcn</span>
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">tailwind</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-[var(--success)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shadow-[0_0_5px_var(--success)]" />
                Available ✓
              </span>
              <Link 
                href="/docs/blocks/login"
                className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors group flex items-center gap-1"
              >
                View Block <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Card 2 — Parallax Hero */}
          <div className="flex flex-col p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 hover:bg-[var(--card)] hover:border-[var(--primary)]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-[var(--foreground)]">Parallax Hero</h4>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  Supreme
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[var(--primary)]/5 text-[var(--primary)]/70 border border-[var(--primary)]/10">
                  R3F
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-6 flex-grow">
              Cinematic parallax hero with depth layers, mouse-tracking 3D tilt, and scroll-driven animations.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">react-three-fiber</span>
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">framer-motion</span>
              <span className="px-2 py-1 bg-[var(--muted)]/50 text-[var(--muted-foreground)] rounded-md text-xs font-mono border border-[var(--border)]/50">glsl</span>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-[var(--success)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shadow-[0_0_5px_var(--success)]" />
                Available ✓
              </span>
              <Link 
                href="/docs/supreme/parallax-hero"
                className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors group flex items-center gap-1"
              >
                View Block <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CLI CTA */}
      <section>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-xl bg-[var(--card)] border border-[var(--border)] border-l-4 border-l-[var(--primary)] shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--docs-elem-surface)] backdrop-blur-[8px] z-0" />
          
          <div className="relative z-10 w-full md:w-1/2">
            <h4 className="text-xl font-bold text-[var(--foreground)] mb-2">
              Install blocks in seconds
            </h4>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Use the GwenUI CLI to add any block directly to your project.
            </p>
            <Link 
              href="/docs/cli/overview"
              className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors group flex items-center gap-1"
            >
              Learn more about the CLI <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="relative z-10 w-full md:w-1/2 flex flex-col gap-2">
            <div className="flex items-center bg-[var(--background)] border border-[var(--border)] rounded-lg py-3 px-4 font-mono text-sm text-[var(--foreground)] shadow-inner">
              <span className="text-[var(--muted-foreground)] select-none mr-3">$</span>
              npm install -g @gwenui/cli
            </div>
            <div className="flex items-center bg-[var(--background)] border border-[var(--border)] rounded-lg py-3 px-4 font-mono text-sm text-[var(--foreground)] shadow-inner">
              <span className="text-[var(--muted-foreground)] select-none mr-3">$</span>
              gwen-ui add auth-login
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
