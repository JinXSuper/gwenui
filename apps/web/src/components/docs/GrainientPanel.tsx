'use client'

import Grainient from '@/components/ui/Grainient'
import { DocsOnThisPage } from './DocsOnThisPage'

export function GrainientPanel() {
  return (
    <aside
      className="hidden xl:flex flex-col fixed top-[52px] right-0 w-[20%] bottom-0 z-40 bg-[var(--background)] border-l border-[var(--docs-border-faint)]"
    >
      {/* Top Section (approx. 80% height) - Interactive "On This Page" */}
      <div className="flex-1 overflow-y-auto w-full px-6 py-10 flex flex-col bg-transparent">
        <DocsOnThisPage />
      </div>

      {/* Bottom Section (approx. 20% height) - Design With Gwen Visual Panel */}
      <div
        className="h-[22%] min-h-[170px] w-full relative overflow-hidden flex flex-col justify-center items-center select-none border-t border-[var(--docs-border-faint)]"
      >
        {/* Background Grainient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              135deg,
              oklch(10% 0.005 265) 0%,
              oklch(25% 0.06 290) 30%,
              oklch(55% 0.16 48) 65%,
              oklch(68% 0.18 48) 100%
            )`,
          }}
        >
          <Grainient className="w-full h-full opacity-60 mix-blend-overlay" />
        </div>

        {/* Left Edge Vignette for smooth blending */}
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to right,
              oklch(10% 0.005 265 / 100%) 0%,
              oklch(10% 0.005 265 / 80%) 5%,
              transparent 35%
            )`
          }}
        />

        {/* Foreground Content */}
        <div className="relative z-20 flex flex-col items-center gap-1.5 px-4 text-center">
          <h2 
            style={{
              fontFamily: 'Lora, serif',
              fontWeight: 700,
              fontSize: 'clamp(1.1rem, 1.4vw, 1.5rem)',
              color: 'white',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            {"Design With\nGwen"}
          </h2>
          
          <p
            className="uppercase"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
            }}
          >
            GwenUI Design System
          </p>
        </div>
      </div>
    </aside>
  )
}
