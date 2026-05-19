"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Grainient from "@/components/ui/Grainient";

export function Hero() {
  return (
    <div className="relative w-full">
      {/* Background layer - Isolated to Hero */}
      <div className="absolute top-0 left-0 w-full h-[100vh] z-0 pointer-events-none overflow-hidden">
        <Grainient
          color1="var(--docs-grain-color-1)"   // Orange
          color2="var(--docs-grain-color-2)"   // Violet
          color3="var(--docs-grain-color-3)"   // Sunset
          timeSpeed={0.4}
          warpFrequency={2.5}
          className="w-full h-full"
        />
        {/* Subtle mask to fade into the main background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
      </div>

      {/* Hero Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center px-6 min-h-[90vh] justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full max-w-4xl text-center relative"
        >
          <h1 className="text-5xl md:text-6xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.8] text-white mb-6">
            Ship fast.<br />
            <span className="heading-gradient-orange">Stay precise.</span>
          </h1>

          <p className="text-[16px] md:text-xl lg:text-2xl text-white/50 leading-relaxed font-medium max-w-3xl mb-10">
            High-performance React blocks for developers who hate re-inventing the wheel. Open-source, accessible, and battle-tested.
          </p>

          <div className="flex items-center gap-3 justify-center mt-8 mb-8">
            <Link 
              href="/blocks"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm tracking-tight transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02]"
            >
              View Blocks
            </Link>
            <a 
              href="https://github.com/JinXSuper/gwenui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group px-6 py-2.5 rounded-full bg-[var(--glass)] border border-border backdrop-blur-xl text-muted-foreground font-semibold text-sm transition-all duration-200 hover:border-[var(--active-glass-border)] hover:bg-[var(--active-glass)] hover:text-foreground"
            >
              GitHub <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
