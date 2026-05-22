import { Box, Lock, Zap } from 'lucide-react';
import Link from 'next/link';

export default function SupremeOverviewPage() {
  return (
    <article className="w-full relative pb-20">
      {/* SECTION 1 — Hero Block */}
      <section className="relative mt-8 mb-16 pt-8 pb-12">
        {/* Animated Glow Behind Hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full max-w-[600px] pointer-events-none -z-10">
          <div className="absolute inset-0 rounded-[100%] bg-[var(--primary)]/20 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        </div>

        <div className="flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-3">
            <h1 className="font-serif font-bold text-5xl tracking-tight text-[var(--foreground)]">
              Supreme Blocks
            </h1>
            <span className="pill-badge px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              Exclusive
            </span>
          </div>
          
          <h2 className="text-xl text-[var(--muted-foreground)] max-w-2xl font-medium">
            Full-page, WebGL-powered blocks built for experiences that go beyond the screen.
          </h2>

          <p className="text-[var(--muted-foreground)]/80 max-w-3xl leading-relaxed mt-2 text-sm md:text-base">
            Supreme blocks are premium, production-ready full-page sections powered by React Three Fiber (R3F), OGL, and Framer Motion. They are meticulously designed for landing pages, portfolios, and products that demand cinematic-level visual quality and uncompromising performance.
          </p>
        </div>
      </section>

      {/* SECTION 2 — Why Supreme? */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[var(--docs-elem-surface)] backdrop-blur-[12px] z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-2 border border-[var(--primary)]/20">
                <Box size={20} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">WebGL Powered</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-1">
                Built with R3F and OGL for GPU-accelerated 3D and shader-based visuals.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[var(--docs-elem-surface)] backdrop-blur-[12px] z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-2 border border-[var(--primary)]/20">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Framer Motion Native</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-1">
                Every block ships with orchestrated animations, scroll-triggered entrances, and gesture support.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[var(--docs-elem-surface)] backdrop-blur-[12px] z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-2 border border-[var(--primary)]/20">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Exclusive Access</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-1">
                Supreme blocks are part of the premium tier. One license, all blocks, forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Available Blocks */}
      <section className="mb-16">
        <h3 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-6 border-b border-[var(--border)] pb-4">
          Available Supreme Blocks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 — Parallax Hero */}
          <div className="flex flex-col p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 hover:bg-[var(--card)] hover:border-[var(--primary)]/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-[var(--foreground)]">Parallax Hero</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/20">
                R3F
              </span>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mb-6 flex-grow">
              A cinematic parallax hero section with depth layers, mouse-tracking 3D tilt, and scroll-driven animations.
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

          {/* Card 2 — Coming Soon */}
          <div className="flex flex-col p-6 rounded-2xl border border-[var(--border)]/50 bg-[var(--card)]/20 opacity-70">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-[var(--foreground)]/70">More blocks coming</h4>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] flex-grow">
              New Supreme blocks drop regularly. Stay tuned.
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6">
              <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                In Development
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Getting Started CTA */}
      <section>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] border-l-4 border-l-[var(--primary)] shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--docs-elem-surface)] backdrop-blur-[8px] z-0" />
          <div className="relative z-10 max-w-lg">
            <h4 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              Ready to go Supreme?
            </h4>
            <p className="text-sm text-[var(--muted-foreground)]">
              Install <code className="text-[var(--primary)] font-mono text-xs px-1 py-0.5 rounded bg-[var(--primary)]/10">@gwenui/supreme</code> and start building.
            </p>
          </div>
          
          <div className="relative z-10 w-full md:w-auto">
            <div className="flex items-center bg-[var(--background)] border border-[var(--border)] rounded-lg py-3 px-4 font-mono text-sm text-[var(--foreground)] shadow-inner">
              <span className="text-[var(--muted-foreground)] select-none mr-3">$</span>
              npm install @gwenui/supreme
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
