"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ParallaxImageLayer {
  src: string;
  depth: number; // Positive for foreground movement, negative for background movement
  xOffset: string; // Tailwind/CSS positioning (e.g. "10%", "-20%")
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

  // Motion values to store normalized mouse position (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Framer Motion spring physics config for elegant inertia
  const springConfig = { stiffness: 85, damping: 22, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Tracks the pointer coordinates, converts to range (-0.5 to 0.5)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalized position relative to center of the container
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Gracefully return to center on mouse leave
    mouseX.set(0);
    mouseY.set(0);
  };

  // Convert smooth spring outputs to spotlight position percentages
  const spotlightX = useTransform(smoothX, (v) => `${(v + 0.5) * 100}%`);
  const spotlightY = useTransform(smoothY, (v) => `${(v + 0.5) * 100}%`);

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
      {/* 1. Cinematic Background Backdrop */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#060408]/90 to-[#030204] pointer-events-none z-0" />
      
      {/* 2. Vector Spotlight Text Backdrop (z-0) */}
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

      {/* 3. Floating 3D Depth Card Stack (z-5) */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden select-none">
        {layers.map((layer, index) => {
          // Translate card movement using springs and layer depth
          // Positive depth moves standard, negative depth moves counter-direction
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
                  width: `${layer.width}px`,
                  height: `${layer.height}px`,
                  transform: `rotate(${layer.rotation || 0}deg)`,
                  boxShadow: "var(--shadow-tier-3), 0 20px 45px rgba(0, 0, 0, 0.6)",
                  zIndex: layer.zIndex,
                }}
              >
                {/* Raw standard <img> to bypass Next.js default downscaling and preserve absolute color vibrancy */}
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

      {/* 4. Center Content & Ambient Backlight Glow (z-10) */}
      {/* pointer-events-none ignores mouse clicks so coordinates flow through, while interactive elements re-enable pointer-events */}
      <div className="relative w-full max-w-3xl flex flex-col items-center justify-center text-center pointer-events-none z-10 py-16">
        
        {/* Colorful dynamic neon ambient backlight drop shadow projection */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] sm:w-[500px] h-[150px] rounded-full bg-gradient-to-r from-orange-500/20 via-pink-500/10 to-teal-400/15 blur-[80px] sm:blur-[120px] pointer-events-none select-none opacity-70" />

        {/* Headline with dynamic lights and Lora serif font */}
        <h1 
          className="font-serif text-[2.5rem] sm:text-[4rem] lg:text-[5rem] font-medium tracking-tight text-white leading-[1.1] mb-6 select-none select-none relative"
          style={{
            fontFamily: "Lora, Georgia, serif",
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}
        >
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
            {headline}
          </span>
        </h1>

        {/* Description and CTA styled with Plus Jakarta Sans */}
        {description && (
          <p className="font-sans text-[15px] sm:text-[17px] text-white/50 max-w-xl mb-10 leading-relaxed font-medium select-none px-4">
            {description}
          </p>
        )}

        {/* CTA Buttons - Explicitly re-enables pointer events for clickability */}
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

      {/* Decorative Bottom Shadow Blend */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[12]"
        style={{
          background: "linear-gradient(to top, #07050a 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
