"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Grainient from "@/components/ui/Grainient";
import { cn } from "@/lib/utils";
import { SourcePanel } from "@/components/docs/SourcePanel";
import type { SourceFile } from "@/components/docs/PreviewPanel";

interface DocsSplitLayoutProps {
  leftContent:   React.ReactNode;
  rightContent?: React.ReactNode;
  sourceFiles?:  SourceFile[];
  type?:         "component" | "text";
  desc?:         string;
}

export function DocsSplitLayout({
  leftContent,
  rightContent,
  sourceFiles,
  type = "component",
  desc = "A dusk-fueled, dark-first premium design system.",
}: DocsSplitLayoutProps) {
  const defaultWidth = type === "text" ? 80 : 50;
  const [leftWidth, setLeftWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasSource = Boolean(sourceFiles && sourceFiles.length > 0);

  useEffect(() => {
    setLeftWidth(type === "text" ? 80 : 50);
  }, [type]);

  /* ── Drag handlers ─────────────────────────────── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newWidth >= 25 && newWidth <= 80) setLeftWidth(newWidth);
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const fadeOpacity = Math.max(0, Math.min(1, (50 - leftWidth) / 25));

  // Inject source toggle callbacks into PreviewPanel via cloneElement
  const rightContentWithCallbacks =
    rightContent && React.isValidElement(rightContent)
      ? React.cloneElement(rightContent as React.ReactElement<{
          isSourceOpen?: boolean;
          hasSource?: boolean;
          onSourceToggle?: () => void;
        }>, {
          isSourceOpen,
          hasSource,
          onSourceToggle: () => setIsSourceOpen((v) => !v),
        })
      : rightContent;

  return (
    <div
      ref={containerRef}
      className="flex w-full h-[calc(100vh-52px)] bg-[var(--docs-page-bg)] text-[var(--docs-text-body)] overflow-hidden relative"
    >
      {/* ── Left Column ── */}
      <motion.div
        style={{ "--left-width": `${leftWidth}%` } as React.CSSProperties}
        className="flex-shrink-0 w-full lg:w-[var(--left-width)] lg:max-w-none h-full relative z-30 lg:border-r lg:border-[var(--docs-border-faint)] bg-[var(--docs-page-bg)] shadow-[15px_0_50px_-10px_var(--split-layout-panel-shadow)]"
      >
        {/* Top/bottom fade shadows */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[var(--docs-page-bg)] to-transparent z-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--docs-page-bg)] to-transparent z-40 pointer-events-none" />

        {/* Left-edge fade mask */}
        <div
          className="absolute inset-0 z-50 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: fadeOpacity,
            background: "linear-gradient(to right, var(--docs-page-bg) 0%, transparent 60%)",
          }}
        />

        {/* Docs content */}
        <div className="absolute inset-0 overflow-y-auto p-8 lg:p-12 custom-scrollbar z-10">
          <div className="w-full max-w-[600px] mx-auto flex flex-col flex-1">
            {leftContent}
          </div>
        </div>

        {/* ── Source overlay — slides up from bottom over docs text ── */}
        <AnimatePresence>
          {isSourceOpen && hasSource && (
            <motion.div
              key="source-overlay"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-[60]"
            >
              <SourcePanel
                sourceFiles={sourceFiles!}
                onClose={() => setIsSourceOpen(false)}
                className="h-full w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Drag Handle ── */}
      <div
        onMouseDown={handleMouseDown}
        className="hidden lg:flex items-center justify-center w-1 cursor-col-resize relative z-40 group/handle hover:w-1.5 transition-all"
      >
        <div className={`absolute inset-y-0 w-px transition-colors duration-150 ${isDragging ? "bg-[var(--primary)]/60" : "bg-transparent group-hover/handle:bg-[var(--primary)]/30"}`} />
        <div className={`flex flex-col gap-1 items-center transition-opacity duration-150 ${isDragging ? "opacity-100" : "opacity-0 group-hover/handle:opacity-100"}`}>
          <div className="w-1 h-1 rounded-full bg-[var(--primary)]/50" />
          <div className="w-1 h-1 rounded-full bg-[var(--primary)]/50" />
          <div className="w-1 h-1 rounded-full bg-[var(--primary)]/50" />
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="flex-1 hidden lg:flex h-full relative group/preview overflow-hidden z-10">
        {isDragging && <div className="absolute inset-0 z-[999] cursor-col-resize" />}

        {type === "text" ? (
          <div className="w-full h-full relative bg-[var(--docs-page-bg)] flex items-center justify-center">
            <div className="absolute inset-0 z-0 opacity-40">
              <Grainient
                color1="var(--primary)"
                color2="var(--grain-purple-blue)"
                color3="var(--grain-pink-sunset)"
                timeSpeed={0.15}
                warpSpeed={0.8}
                zoom={1.3}
              />
            </div>
            <div
              className="absolute inset-0 z-1 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at center, var(--split-layout-dot-faint) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2.5">GwenUI</span>
              <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_var(--split-layout-text-shadow)]">
                Build with GwenUI
              </h3>
              <p className="text-[11px] text-white/40 max-w-[200px] mt-1.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 z-0 bg-[var(--docs-page-bg)]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "radial-gradient(circle at center, var(--split-layout-dot-medium) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-700 ease-out"
                style={{
                  backgroundImage: "radial-gradient(circle at center, var(--split-layout-dot-glow) 1.5px, transparent 1.5px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--docs-page-bg)] via-transparent to-[var(--docs-page-bg)] opacity-50 pointer-events-none" />
            </div>
            <div className="relative z-10 w-full h-full min-h-0 flex flex-col p-3">
              {rightContentWithCallbacks}
            </div>
          </div>
        )}
      </div>

      <style suppressHydrationWarning>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--split-layout-scroll-thumb); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--split-layout-scroll-thumb-hover); }
      `}</style>
    </div>
  );
}
