/**
 * Block: Bento Grid
 * Author: JinXSuper
 * License: MIT
 */
"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Zap, Shield, Moon, GitBranch, Gauge, Sliders,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── Embedded responsive grid CSS ──────────────────────── */
/* Tailwind v4 can't scan this file (external package),      */
/* so we ship our own responsive grid rules via <style>.     */

const BENTO_STYLES = `
  .bento-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 1rem;
    grid-auto-rows: minmax(220px, auto);
    width: 100%;
    max-width: 72rem;
    margin-left: auto;
    margin-right: auto;
    padding: 3rem 1rem;
  }
  .bento-cell {
    grid-column: span 12 / span 12;
    min-height: 220px;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 1.25rem;
    width: 100%;
    min-width: 0;
  }
  .bento-cell[data-size="hero"] {
    min-height: 420px;
  }
  @media (min-width: 640px) {
    .bento-cell[data-size="md"],
    .bento-cell[data-size="sm"] {
      grid-column: span 6 / span 6;
    }
  }
  @media (min-width: 1024px) {
    .bento-cell[data-size="hero"] {
      grid-column: span 8 / span 8;
      grid-row: span 2 / span 2;
    }
    .bento-cell[data-size="md"],
    .bento-cell[data-size="sm"] {
      grid-column: span 4 / span 4;
    }
  }
`

/* ─── Types ─────────────────────────────────────────────── */

export interface BentoCellProps {
  size:        "hero" | "md" | "sm"
  icon:        LucideIcon
  label:       string
  title:       string
  description: string
  children?:   React.ReactNode
  className?:  string
  index?:      number
}

/* ─── Decorative orb — hero cell only ───────────────────── */

const HeroOrb: React.FC = () => (
  <div
    className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden rounded-r-[1.25rem]"
    aria-hidden
  >
    <div
      className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full opacity-25"
      style={{
        background:
          "radial-gradient(circle, oklch(0.72 0.15 48) 0%, oklch(0.55 0.18 290) 55%, transparent 80%)",
        filter: "blur(56px)",
      }}
    />
    <div
      className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full opacity-15"
      style={{
        background: "radial-gradient(circle, oklch(0.85 0.12 48) 0%, transparent 70%)",
        filter: "blur(28px)",
      }}
    />
    <svg
      className="absolute right-[8%] top-1/2 -translate-y-1/2"
      style={{ opacity: 0.08 }}
      width="180"
      height="180"
      viewBox="0 0 200 200"
      fill="none"
    >
      <circle cx="100" cy="100" r="90" stroke="oklch(0.72 0.15 48)" strokeWidth="1" strokeDasharray="6 4" />
      <circle cx="100" cy="100" r="58" stroke="oklch(0.55 0.18 290)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="28" stroke="oklch(0.72 0.15 48)" strokeWidth="0.5" strokeDasharray="3 3" />
    </svg>
  </div>
)

/* ─── BentoCell ──────────────────────────────────────────── */

export const BentoCell: React.FC<BentoCellProps> = ({
  size,
  icon: Icon,
  label,
  title,
  description,
  children,
  className,
  index = 0,
}) => {
  const isHero = size === "hero"

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      whileHover={{ y: -2 }}
      className={cn("bento-cell", className)}
      data-size={size}
      style={{
        background: "oklch(0.13 0.005 265)",
        border: "1px solid oklch(0.68 0.18 48 / 20%)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 oklch(100% 0 0 / 4%)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = "oklch(0.68 0.18 48 / 40%)"
        el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 oklch(100% 0 0 / 6%)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = "oklch(0.68 0.18 48 / 20%)"
        el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 oklch(100% 0 0 / 4%)"
      }}
    >
      {/* Hero glass shimmer */}
      {isHero && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "oklch(100% 0 0 / 2%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />
      )}

      {/* Decorative orb — hero only */}
      {isHero && <HeroOrb />}

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex flex-col h-full min-w-0",
          isHero ? "p-8 md:p-10" : "p-6"
        )}
      >
        {/* Icon + label */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{
              background: "oklch(0.72 0.15 48 / 12%)",
              border: "1px solid oklch(0.72 0.15 48 / 20%)",
            }}
          >
            <Icon className="w-4 h-4" style={{ color: "oklch(0.72 0.15 48)" }} />
          </div>
          <span
            className="text-[10px] font-mono font-semibold uppercase tracking-[0.15em] truncate"
            style={{ color: "oklch(0.68 0.18 48 / 60%)" }}
          >
            {label}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "font-bold tracking-tight mt-5 leading-tight min-w-0",
            isHero
              ? "text-3xl md:text-4xl lg:text-5xl line-clamp-2"
              : "text-xl line-clamp-2"
          )}
          style={{
            color: "oklch(0.97 0.01 85)",
            fontFamily: "var(--font-plus-jakarta-sans, 'Plus Jakarta Sans', sans-serif)",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            "mt-3 leading-relaxed min-w-0 line-clamp-3",
            isHero ? "text-base max-w-sm" : "text-sm"
          )}
          style={{ color: "oklch(0.65 0.02 285)" }}
        >
          {description}
        </p>

        {/* Children slot — pushed to bottom */}
        {children && <div className="mt-auto pt-4">{children}</div>}
      </div>
    </motion.div>
  )
}

/* ─── Demo data ──────────────────────────────────────────── */

const DEMO_CELLS: Omit<BentoCellProps, "index">[] = [
  {
    size: "hero",
    icon: Zap,
    label: "Core Feature",
    title: "Ship Faster",
    description:
      "Drop in production-ready blocks and go from idea to deployed in minutes, not days. Every component is built to the highest standard.",
    children: (
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer"
          style={{
            background: "oklch(0.72 0.15 48)",
            color: "oklch(0.12 0.005 265)",
            boxShadow: "0 0 20px oklch(0.72 0.15 48 / 30%)",
          }}
        >
          <Zap className="w-3.5 h-3.5" />
          Get Started
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            border: "1px solid oklch(0.68 0.18 48 / 25%)",
            color: "oklch(0.75 0.02 285)",
          }}
        >
          View Blocks
        </span>
      </div>
    ),
  },
  {
    size: "md",
    icon: Shield,
    label: "TypeScript",
    title: "Type-safe",
    description:
      "Every block ships with full TypeScript types. Autocomplete, refactoring, and zero runtime surprises.",
  },
  {
    size: "md",
    icon: Moon,
    label: "Theming",
    title: "Dark by default",
    description:
      "Built on OKLCH color science. Gwen Noir dark theme ships out of the box — light mode is one token swap.",
  },
  {
    size: "sm",
    icon: GitBranch,
    label: "License",
    title: "Open Source",
    description: "MIT licensed. Own your code, fork freely, ship commercially.",
  },
  {
    size: "sm",
    icon: Gauge,
    label: "Perf",
    title: "Performance",
    description:
      "Zero runtime CSS-in-JS. Tailwind v4 + static extraction keeps bundles lean.",
  },
  {
    size: "sm",
    icon: Sliders,
    label: "DX",
    title: "Customizable",
    description:
      "CSS variables for every token. Swap colors, radii, and shadows globally in one file.",
  },
]

/* ─── BentoGrid ──────────────────────────────────────────── */

export const BentoGrid: React.FC<{ className?: string }> = ({ className }) => (
  <div className="w-full overflow-x-hidden">
    <style dangerouslySetInnerHTML={{ __html: BENTO_STYLES }} />
    <div className={cn("bento-grid", className)}>
      {DEMO_CELLS.map((cell, i) => (
        <BentoCell key={i} {...cell} index={i} />
      ))}
    </div>
  </div>
)

export default BentoGrid
