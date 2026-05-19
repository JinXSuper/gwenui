'use client'

import * as React from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Button } from '../../../ui/button'
import { FloatingImage } from './FloatingImage'
import { TextHoverEffect } from '../../../ui/text-hover-effect'
import type { ParallaxHeroProps } from './types'

export function ParallaxHero({
  headline = 'Build something extraordinary.',
  description = 'GwenUI Supreme — where design meets dimension.',
  primaryCta = 'Explore Blocks',
  secondaryCta = 'View Source',
  onPrimaryClick,
  onSecondaryClick,
  layers = [],
  bgText = 'GWEN',
  className = '',
}: ParallaxHeroProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }, [mouseX, mouseY])

  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center ${className}`}
      style={{
        background: 'var(--background)',
      }}
    >
      {/* 1. Background outlined shimmering text (z-index: 0) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
        <TextHoverEffect text={bgText} />
      </div>

      {/* 2. Floating parallax images wrapper (z-index: 5) */}
      <div className="absolute inset-0 z-5 pointer-events-none select-none">
        {layers.map((layer) => (
          <FloatingImage
            key={layer.id}
            layer={layer}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>

      {/* Vignette overlay for cinematic backdrop shading */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, oklch(10% 0.005 265 / 65%) 100%)',
        }}
      />

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 z-[7] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px',
        }}
      />

      {/* 3. Center content layer (z-index: 10) */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl gap-6 pointer-events-none"
      >
        {/* Headline (Lora Serif) with Gradient Shadow Glow */}
        <div className="relative flex items-center justify-center select-none max-w-[700px]">
          {/* Blurred background glow layer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 font-serif font-bold leading-[1.1] tracking-tight blur-2xl pointer-events-none select-none"
            style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              backgroundImage: 'linear-gradient(135deg, oklch(68% 0.18 48), oklch(75% 0.15 150), oklch(68% 0.18 48))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {headline}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 font-serif font-bold leading-[1.1] tracking-tight"
            style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--text)',
            }}
          >
            {headline}
          </motion.h1>
        </div>

        {/* Description (Plus Jakarta Sans) */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-normal max-w-[520px]"
            style={{
              fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
              fontSize: '1.125rem',
              color: 'var(--text-muted)',
            }}
          >
            {description}
          </motion.p>
        )}

        {/* Actions Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex gap-3 justify-center pointer-events-auto"
        >
          {/* PRIMARY BUTTON */}
          <Button
            onClick={onPrimaryClick}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              borderRadius: '9999px',
              padding: '0.625rem 1.5rem',
              fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
              fontWeight: 500,
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
            className="hover:opacity-90 transition-opacity active:scale-[0.98] duration-150"
          >
            {primaryCta}
          </Button>

          {/* SECONDARY BUTTON */}
          <Button
            variant="outline"
            onClick={onSecondaryClick}
            style={{
              borderRadius: '9999px',
              borderColor: 'var(--border)',
              color: 'var(--text)',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
              fontWeight: 500,
              padding: '0.625rem 1.5rem',
              cursor: 'pointer',
            }}
            className="hover:bg-white/5 transition-colors active:scale-[0.98] duration-150"
          >
            {secondaryCta}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
