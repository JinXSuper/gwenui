/**
 * Block: Testimonial Marquee
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { MarqueeRow } from "./components/MarqueeRow"

// ─── Types ──────────────────────────────────────────────────────

interface Testimonial {
  id: string
  name: string
  handle: string
  avatar: string
  quote: string
  date: string
  verified?: boolean
}

interface TestimonialMarqueeProps {
  testimonials?: Testimonial[]
  speed?: number
  rows?: 1 | 2
  pauseOnHover?: boolean
  onHoverPause?: boolean | "yes" | "no"
  className?: string
  animated?: boolean | "yes" | "no"
}

// ─── Default Data ───────────────────────────────────────────────

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Liora Gwen",
    handle: "@lioragwen",
    avatar: "https://picsum.photos/seed/liora/100/100",
    quote:
      "GwenUI blocks are honestly the most beautiful thing I've ever seen. Papa JinXSuper cooked fr 🔥",
    date: "Mar 12, 2025",
    verified: true,
  },
  {
    id: "2",
    name: "Gwen",
    handle: "@gwenui",
    avatar: "https://picsum.photos/seed/gwen/100/100",
    quote:
      "I helped build this and I'm still impressed. The token system is chef's kiss 🧡",
    date: "Apr 2, 2025",
    verified: true,
  },
  {
    id: "3",
    name: "Alex Rivera",
    handle: "@alexrivera",
    avatar: "https://picsum.photos/seed/alex/100/100",
    quote:
      "Replaced my entire design system with GwenUI in a weekend. Zero regrets.",
    date: "Jan 20, 2025",
    verified: false,
  },
  {
    id: "4",
    name: "Sarah Chen",
    handle: "@sarahchen",
    avatar: "https://picsum.photos/seed/sarah/100/100",
    quote:
      "The dark theme is so good I don't even want to look at my old projects anymore.",
    date: "Feb 5, 2025",
    verified: true,
  },
  {
    id: "5",
    name: "Marcus Kim",
    handle: "@marcuskim",
    avatar: "https://picsum.photos/seed/marcus/100/100",
    quote:
      "gwenui add testimonial-marquee and I was done in 5 minutes. insane dx.",
    date: "Mar 28, 2025",
    verified: false,
  },
  {
    id: "6",
    name: "Priya Nair",
    handle: "@priyanair",
    avatar: "https://picsum.photos/seed/priya/100/100",
    quote:
      "The animation presets alone are worth it. Linear vibes but make it orange 🔥",
    date: "Apr 10, 2025",
    verified: true,
  },
  {
    id: "7",
    name: "Tom Walsh",
    handle: "@tomwalsh",
    avatar: "https://picsum.photos/seed/tom/100/100",
    quote:
      "Finally a component library that doesn't look like every other SaaS landing page.",
    date: "Feb 18, 2025",
    verified: false,
  },
  {
    id: "8",
    name: "Yuki Tanaka",
    handle: "@yukitanaka",
    avatar: "https://picsum.photos/seed/yuki/100/100",
    quote:
      "GwenUI Supreme blocks hit different. That parallax hero is unreal.",
    date: "Mar 5, 2025",
    verified: true,
  },
]

// ─── Main Block ─────────────────────────────────────────────────

export default function TestimonialMarquee({
  testimonials = DEFAULT_TESTIMONIALS,
  speed = 50,
  rows = 2,
  pauseOnHover = true,
  onHoverPause = true,
  className,
  animated = true,
}: TestimonialMarqueeProps) {
  // Split testimonials into two rows
  const midpoint = Math.ceil(testimonials.length / 2)
  const row1 = testimonials.slice(0, midpoint)
  const row2 = testimonials.slice(midpoint)

  return (
    <section className={cn("w-full py-16 md:py-24 overflow-hidden", className)}>
      {/* Header */}
      <div className="text-center mb-10 md:mb-16 px-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">
          Testimonials
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-3">
          Loved by developers
        </h2>
        <p className="text-muted-foreground mt-2 md:mt-3 text-sm sm:text-base max-w-md mx-auto">
          Don&apos;t take our word for it. Here&apos;s what people are saying.
        </p>
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <MarqueeRow
          items={row1}
          speed={speed}
          direction="left"
          pauseOnHover={pauseOnHover}
          onHoverPause={onHoverPause}
          animated={animated}
        />
        {rows === 2 && (
          <MarqueeRow
            items={row2}
            speed={speed}
            direction="right"
            pauseOnHover={pauseOnHover}
            onHoverPause={onHoverPause}
            animated={animated}
          />
        )}
      </div>
    </section>
  )
}
