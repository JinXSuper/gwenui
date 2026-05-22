/**
 * Block: Testimonial Marquee
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client"

import React, { useState } from "react"
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { TestimonialCard } from "./TestimonialCard"

interface Testimonial {
  id: string
  name: string
  handle: string
  avatar: string
  quote: string
  date: string
  verified?: boolean
}

interface MarqueeRowProps {
  items: Testimonial[]
  speed: number
  direction: "left" | "right"
  pauseOnHover?: boolean
  onHoverPause?: boolean | "yes" | "no"
  animated?: boolean | "yes" | "no"
}

export function MarqueeRow({
  items,
  speed,
  direction,
  pauseOnHover = true,
  onHoverPause = true,
  animated = true,
}: MarqueeRowProps) {
  const isAnimated = animated === true || animated === "yes"
  const shouldPauseOnHover =
    (onHoverPause === true || onHoverPause === "yes") && pauseOnHover !== false

  const [isHovered, setIsHovered] = useState(false)

  // Framer Motion motion values for ultra-performant dynamic animation
  const x = useMotionValue(direction === "left" ? 0 : -50)
  const speedMultiplier = useMotionValue(1)
  const transformStyle = useTransform(x, (val) => `translate3d(${val}%, 0, 0)`)

  useAnimationFrame((time, delta) => {
    if (!isAnimated) return

    // Cap delta to prevent huge jumps when returning from background tabs
    const cappedDelta = Math.min(delta, 100)

    // Smooth linear deceleration / acceleration on hover transition
    const targetSpeed = isHovered && shouldPauseOnHover ? 0 : 1
    const currentSpeed = speedMultiplier.get()
    const newSpeed = currentSpeed + (targetSpeed - currentSpeed) * 0.08 // smooth damping LERP
    speedMultiplier.set(newSpeed)

    // Calculate percentage shift based on loop speed
    // 50% width traveled in exactly `speed` seconds
    const percentPerSecond = 50 / speed
    const step = (cappedDelta / 1000) * percentPerSecond * newSpeed

    let currentX = x.get()
    if (direction === "left") {
      currentX -= step
      if (currentX <= -50) {
        currentX += 50
      }
    } else {
      currentX += step
      if (currentX >= 0) {
        currentX -= 50
      }
    }
    x.set(currentX)
  })

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={cn(
          "flex gap-3 sm:gap-4 w-max",
          !isAnimated && "overflow-x-auto scrollbar-none py-2 px-4 max-w-full mx-auto justify-center"
        )}
        style={
          isAnimated
            ? {
                transform: transformStyle,
              }
            : undefined
        }
      >
        {isAnimated ? (
          // Duplicate items for seamless loop in animated mode
          [...items, ...items].map((item, i) => (
            <TestimonialCard key={`${item.id}-${i}`} testimonial={item} />
          ))
        ) : (
          // Render only original items in static mode
          items.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))
        )}
      </motion.div>
    </div>
  )
}
