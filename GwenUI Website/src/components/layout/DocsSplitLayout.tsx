"use client";

import { useState, useEffect } from "react";
import Grainient from "@/components/ui/Grainient";

interface DocsSplitLayoutProps {
  leftContent: React.ReactNode;
  rightContent?: React.ReactNode;
  type?: "component" | "text";
  desc?: string;
}

export function DocsSplitLayout({
  leftContent,
  rightContent,
  type = "component",
  desc = "A dusk-fueled, dark-first premium design system.",
}: DocsSplitLayoutProps) {
  // Determine default starting width (50% for components, 80% for text)
  const defaultWidth = type === "text" ? 80 : 50;
  const [leftWidth, setLeftWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);

  // Sync width if type changes dynamically
  useEffect(() => {
    setLeftWidth(type === "text" ? 80 : 50);
  }, [type]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      // Clamp between 20% and 85% to keep both panels readable
      if (newWidth >= 20 && newWidth <= 85) {
        setLeftWidth(newWidth);
      }
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

  return (
    <div className="flex w-full h-[calc(100vh-52px)] bg-[var(--docs-page-bg)] text-[var(--docs-text-body)] overflow-hidden relative">
      
      {/* Left Column - Wrapper (Resizable via leftWidth) */}
      <div
        style={{ "--left-width": `\${leftWidth}%` } as React.CSSProperties}
        className="flex-shrink-0 w-full lg:w-[var(--left-width)] lg:max-w-none h-full relative z-30 lg:border-r lg:border-[var(--docs-border-faint)] bg-[var(--docs-page-bg)] shadow-[15px_0_50px_-10px_var(--split-layout-panel-shadow)]"
      >
        {/* Subtle top/bottom inner shadows (fixed over scroll) */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[var(--docs-page-bg)] to-transparent z-40 pointer-events-none opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--docs-page-bg)] to-transparent z-40 pointer-events-none opacity-100" />
 
        {/* Scrollable Content */}
        <div className="w-full h-full overflow-y-auto p-8 lg:p-12 flex flex-col custom-scrollbar relative z-10">
          {/* Centered Content Wrapper */}
          <div className="w-full max-w-[600px] mx-auto flex flex-col flex-1">
            {leftContent}
          </div>
        </div>
      </div>
 
      {/* Right Column - Preview Area (Immersive & Edge-to-Edge) */}
      <div
        className="flex-1 hidden lg:flex h-full relative group/preview overflow-hidden"
      >
        {type === "text" ? (
          /* Text Page: 20% Panel with custom Grainient and Branding */
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
            
            {/* Dot pattern overlay */}
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
              <p className="text-[11px] text-white/40 max-w-[200px] mt-1.5 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ) : (
          /* Component Page: 50% Panel containing interactive Preview or Mockup */
          <div className="w-full h-full relative">
            {/* Dot Background with Glow Effect */}
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
 
            <div className="relative z-10 w-full h-full flex flex-col">
              {rightContent}
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar and helper styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--split-layout-scroll-thumb);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--split-layout-scroll-thumb-hover);
          }
        `,
      }} />
    </div>
  );
}
