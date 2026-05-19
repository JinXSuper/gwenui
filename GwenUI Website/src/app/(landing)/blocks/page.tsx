"use client";

import { useState } from "react";
import { BLOCKS, BlockCategory } from "@/lib/blocks-registry";
import { BlockCard } from "@/components/blocks/BlockCard";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
} as const;

export default function BlocksPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>("Text Animations");

  const categories: BlockCategory[] = [
    "Text Animations",
    "Components",
    "Hero Backgrounds",
    "Visual Effects",
  ];

  const filteredBlocks = BLOCKS.filter((block) => block.category === selectedCategory);

  return (
    <main className="relative min-h-screen w-full bg-background text-foreground flex flex-col font-sans overflow-x-hidden pt-24 md:pt-32 pb-32">
      {/* Viewport Top Receding Shadow */}
      <div 
        className="fixed top-0 left-0 right-0 h-24 pointer-events-none z-40 opacity-100"
        style={{
          background: "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
        }}
      />

      {/* Viewport Bottom Receding Shadow */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-40 opacity-100"
        style={{
          background: "linear-gradient(to top, var(--background) 0%, transparent 100%)",
        }}
      />

      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none select-none" />
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-[oklch(70%_0.15_252)]/3 blur-[100px] pointer-events-none select-none" />

      <div className="max-w-6xl w-full mx-auto px-6 relative z-10">
        {/* Page Header */}
        <header className="mb-12">
          <h1 className="font-serif text-[2.5rem] font-bold tracking-tight heading-gradient-white leading-none mb-2 select-none">
            Blocks
          </h1>
          <p className="text-[0.9375rem] text-[var(--muted-foreground)] font-medium select-none">
            Production-ready blocks. Drop in, ship fast.
          </p>
        </header>

        {/* Section Header (Dynamic Category Title) */}
        <div className="mb-6 flex items-center justify-between border-none outline-none select-none">
          <h2 className="font-sans text-xl font-bold text-white tracking-tight">
            {selectedCategory}
          </h2>
          <span className="text-xs text-[var(--muted-foreground)] font-mono">
            {filteredBlocks.length} {filteredBlocks.length === 1 ? "block" : "blocks"}
          </span>
        </div>

        {/* Blocks Grid (3 Columns on Desktop, 2 Columns on Tablet, 1 Column on Mobile) */}
        {filteredBlocks.length === 0 ? (
          <div className="w-full py-20 flex flex-col items-center justify-center rounded-2xl bg-white/[0.01] border border-white/5 outline-none">
            <svg
              width="28"
              height="28"
              viewBox="0 0 14 14"
              fill="none"
              className="text-white/20 mb-3 animate-pulse"
            >
              <path d="M7 0.5L13.5 7L7 13.5L0.5 7L7 0.5Z" fill="currentColor" />
            </svg>
            <p className="text-sm text-[var(--muted-foreground)] font-medium">
              No blocks available in this category yet.
            </p>
          </div>
        ) : (
          <motion.div 
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-none outline-none"
          >
            {filteredBlocks.map((block) => (
              <motion.div
                variants={itemVariants}
                key={block.id}
                className="outline-none"
              >
                <BlockCard block={block} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Floating Pill Category Selector at the Bottom Center */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 select-none">
        <div 
          className="flex items-center gap-1 p-1 rounded-[12px] backdrop-blur-md relative overflow-hidden"
          style={{
            background: "oklch(10% 0.015 285 / 85%)",
            border: "var(--border-dashed)",
            boxShadow: "var(--shadow-tier-3)",
          }}
        >
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4.5 py-2.5 rounded-[9px] text-[13px] font-semibold transition-colors duration-200 cursor-pointer border-none outline-none whitespace-nowrap relative ${
                  active
                    ? "text-white"
                    : "text-white/40 hover:text-white/80"
                }`}
                style={{
                  outline: "none",
                  background: "transparent",
                }}
              >
                {active && (
                  <motion.div
                    layoutId="active-category-pill"
                    className="absolute inset-0 bg-white/[0.08] rounded-[9px]"
                    style={{
                      boxShadow: "var(--shadow-tier-2)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
