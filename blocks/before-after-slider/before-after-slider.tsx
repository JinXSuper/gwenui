/**
 * Block: Before-After Slider
 * Author: Implemented by JinXSuper
 * License: MIT
 *
 * Features:
 * - Elastic spring on horizontal drag (clip-path reveal)
 * - Stretch effect on divider line based on drag velocity
 * - Holder can be dragged vertically, snaps back to center on release
 */
"use client"

import React, { useState, useRef, useCallback } from "react"
import { motion, useSpring, useTransform, useMotionValue, useVelocity } from "framer-motion"
import { cn } from "@/lib/utils"

/* ─── Types ─────────────────────────────────────────────── */

export interface SliderImage {
  src: string
  alt?: string
  label?: string
}

export interface BeforeAfterSliderProps {
  before: SliderImage
  after: SliderImage
  initialPosition?: number // 0–100, default 50
  className?: string
}

/* ─── Entrance animation ────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/* ─── Default images ────────────────────────────────────── */

const DEFAULT_BEFORE: SliderImage = {
  src: "/blocks/before-after/gwen-8bit.png",
  alt: "Before",
  label: "Before",
}

const DEFAULT_AFTER: SliderImage = {
  src: "/blocks/before-after/gwen-4k.png",
  alt: "After",
  label: "After",
}

/* ─── Strip lines handle ────────────────────────────────── */

const StripHandle: React.FC<{ isDragging: boolean }> = ({ isDragging }: { isDragging: boolean }) => (
  <div
    className="relative flex items-center justify-center rounded-full"
    style={{
      width: 44,
      height: 44,
      background: "rgba(255,255,255,0.12)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1.5px solid rgba(255,255,255,0.35)",
      boxShadow: isDragging
        ? "0 0 0 3px rgba(255,255,255,0.25), 0 0 24px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)"
        : "0 0 0 1.5px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.35)",
      transition: "box-shadow 0.2s ease",
    }}
  >
    {/* Strip lines — 3 vertical bars */}
    <div className="flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: i === 1 ? 14 : 10,
            borderRadius: 2,
            background: isDragging
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.65)",
            transition: "background 0.2s ease, height 0.2s ease",
          }}
        />
      ))}
    </div>
  </div>
)

/* ─── Component ─────────────────────────────────────────── */

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  before = DEFAULT_BEFORE,
  after = DEFAULT_AFTER,
  initialPosition = 50,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const [dragging, setDragging] = useState(false)

  // ── Horizontal position (0–100) ──────────────────────────
  const rawPosition = useMotionValue(initialPosition)
  const springPosition = useSpring(rawPosition, {
    stiffness: 380,
    damping: 28,
    mass: 0.6,
  })

  // Velocity of the spring for stretch effect
  const velocity = useVelocity(springPosition)

  // Clip path for after image
  const clipPath = useTransform(
    springPosition,
    (v: number) => `inset(0 0 0 ${v}%)`
  )
  const leftPct = useTransform(springPosition, (v: number) => `${v}%`)

  // Stretch: scaleX on the divider line based on velocity
  // Fast drag → line squishes (scaleX < 1), slow → normal
  const lineScaleX = useTransform(
    velocity,
    [-2000, -800, 0, 800, 2000],
    [0.3, 0.6, 1, 0.6, 0.3]
  )
  // Compensate height so line appears to "stretch" taller when squished
  const lineScaleY = useTransform(
    velocity,
    [-2000, -800, 0, 800, 2000],
    [1.6, 1.25, 1, 1.25, 1.6]
  )

  // ── Vertical drag on holder ──────────────────────────────
  const rawHandleY = useMotionValue(0)
  const springHandleY = useSpring(rawHandleY, {
    stiffness: 320,
    damping: 22,
    mass: 0.5,
  })
  const isVertDragging = useRef(false)
  const vertDragStart = useRef({ y: 0, val: 0 })

  // ── Position calc (horizontal) ───────────────────────────
  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    const pct = ((clientX - left) / width) * 100
    rawPosition.set(Math.min(Math.max(pct, 2), 98))
  }, [rawPosition])

  // ── Pointer handlers ─────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    isVertDragging.current = true
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    updatePosition(e.clientX)
    vertDragStart.current = { y: e.clientY, val: rawHandleY.get() }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    updatePosition(e.clientX)

    // Vertical drag — clamped with resistance beyond ±60px
    if (isVertDragging.current) {
      const el = containerRef.current
      if (!el) return
      const { height } = el.getBoundingClientRect()
      const maxPull = height * 0.35 // max 35% of container height
      const delta = e.clientY - vertDragStart.current.y
      // Apply rubber-band resistance beyond ±30px
      const resistance = (v: number) => {
        const abs = Math.abs(v)
        if (abs < 30) return v
        const over = abs - 30
        return Math.sign(v) * (30 + over * 0.35)
      }
      const clamped = Math.min(Math.max(resistance(delta), -maxPull), maxPull)
      rawHandleY.set(clamped)
    }
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false
    isVertDragging.current = false
    setDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
    // Snap handle back to vertical center
    rawHandleY.set(0)
  }

  /* ── Render ─────────────────────────────────────── */

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={containerVariants}
      className={cn("w-full", className)}
    >
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl select-none cursor-ew-resize"
        style={{ aspectRatio: "16/9" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Before image */}
        <img
          src={before.src}
          alt={before.alt ?? "Before"}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* After image — spring clip */}
        <motion.img
          src={after.src}
          alt={after.alt ?? "After"}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ clipPath }}
          draggable={false}
        />

        {/* Divider line — stretch effect via scaleX/scaleY */}
        <motion.div
          className="absolute top-0 bottom-0 pointer-events-none z-10 origin-center"
          style={{
            left: leftPct,
            width: 2,
            scaleX: lineScaleX,
            scaleY: lineScaleY,
            background: dragging
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.6)",
            boxShadow: dragging
              ? "0 0 12px rgba(255,255,255,0.5), 0 0 4px rgba(255,255,255,0.8)"
              : "0 0 6px rgba(255,255,255,0.2)",
            transition: "background 0.15s ease, box-shadow 0.15s ease",
          }}
        />

        {/* Handle — horizontal spring + vertical spring drag */}
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{
            left: leftPct,
            top: "50%",
            x: "-50%",
            // Combine vertical spring offset with the -50% centering
            y: useTransform(springHandleY, (v: number) => `calc(-50% + ${v}px)`),
          }}
        >
          <motion.div
            animate={{ scale: dragging ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <StripHandle isDragging={dragging} />
          </motion.div>
        </motion.div>

        {/* Before label */}
        {before.label && (
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
              {before.label}
            </span>
          </div>
        )}

        {/* After label */}
        {after.label && (
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
              {after.label}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BeforeAfterSlider
