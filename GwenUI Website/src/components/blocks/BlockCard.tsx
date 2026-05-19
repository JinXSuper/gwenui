"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Block } from "@/lib/blocks-registry";
import { Copy, Check } from "lucide-react";

interface BlockCardProps {
  block: Block;
}

export function BlockCard({ block }: BlockCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // 400ms hover delay before loading the iframe
    hoverTimeoutRef.current = setTimeout(() => {
      setShouldLoad(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Cancel load if still in loading state (clearTimeout)
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(block.installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine Badge Styles based on category - borderless & headless
  const getBadgeStyle = () => {
    switch (block.category) {
      case "Text Animations":
        return {
          background: "oklch(100% 0 0 / 6%)",
          color: "oklch(65% 0.008 265)",
          border: "none",
        };
      case "Components":
        return {
          background: "oklch(70% 0.15 252 / 10%)",
          color: "oklch(75% 0.15 252)",
          border: "none",
        };
      case "Hero Backgrounds":
        return {
          background: "oklch(68% 0.18 48 / 8%)",
          color: "var(--primary)",
          border: "none",
        };
      case "Visual Effects":
        return {
          background: "oklch(68% 0.18 48 / 8%)",
          color: "var(--primary)",
          boxShadow: "0 0 12px oklch(68% 0.18 48 / 15%)",
          animation: "supreme-glow 2s infinite",
          border: "none",
        };
      default:
        return { border: "none" };
    }
  };

  // Determine if shimmer skeleton should show
  const showShimmer = shouldLoad && !iframeLoaded;

  return (
    <Link href={block.docsUrl} className="block no-underline group/card outline-none">
      <div
        className="w-full bg-[var(--surface)] overflow-hidden cursor-pointer transition-all duration-300 rounded-[16px] relative p-4 flex flex-col gap-3 group-hover/card:translate-y-[-2px]"
        style={{
          boxShadow: "var(--shadow-tier-3)",
          border: "var(--border-dashed)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        {/* Preview Area (16:9 ratio) - Tier 3 radial glow styled */}
        <div
          className="relative w-full aspect-[16/9] overflow-hidden select-none transition-colors duration-300 rounded-[12px]"
          style={{
            background: "oklch(12% 0.018 285)",
            backgroundImage: "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(68% 0.18 48 / 8%) 0%, transparent 70%)",
            border: "var(--border-dashed)",
          }}
        >
          {/* Default (idle) / placeholder screen */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10 px-4 text-center">
              <span className="font-sans font-semibold text-[13px] text-white/30 tracking-wide transition-colors duration-200 group-hover/card:text-white/50">
                {block.name}
              </span>
            </div>
          )}

          {/* Skeleton Shimmer Animation */}
          {showShimmer && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center"
              style={{
                background: "linear-gradient(90deg, var(--surface) 0%, oklch(100% 0 0 / 6%) 50%, var(--surface) 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 14 14"
                fill="none"
                className="text-white/20 animate-pulse"
              >
                <path d="M7 0.5L13.5 7L7 13.5L0.5 7L7 0.5Z" fill="currentColor" />
              </svg>
            </div>
          )}

          {/* Iframe Preview */}
          {shouldLoad && (
            <iframe
              src={block.previewUrl}
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-full border-none pointer-events-none transition-all duration-300"
              style={{
                opacity: iframeLoaded ? 1 : 0,
                filter: isHovered ? "grayscale(0) opacity(1)" : "grayscale(1) opacity(0.4)",
              }}
              scrolling="no"
              title={`${block.name} Preview`}
            />
          )}
        </div>

        {/* Card Info Area - Headless (No border, padding aligned to content) */}
        <div className="flex flex-col gap-1.5 bg-transparent select-text">
          {/* Row 1: Name & Optional Category Badge */}
          <div className="flex items-center justify-between gap-3">
            <span className="font-sans text-[0.9375rem] font-semibold text-white tracking-tight group-hover/card:text-[var(--primary)] transition-colors duration-200 truncate max-w-[70%]">
              {block.name}
            </span>
            <span
              className="px-2 py-0.5 text-[9px] font-bold tracking-wider rounded-md uppercase transition-all select-none border-none outline-none"
              style={getBadgeStyle()}
            >
              {block.category}
            </span>
          </div>

          {/* Row 2: Description */}
          <p className="text-[0.8125rem] text-[var(--muted-foreground)] leading-snug line-clamp-2 select-text">
            {block.description}
          </p>

          {/* Row 3: Install command - Headless, transparent, no-outline */}
          <div 
            className="flex items-center justify-between gap-2 mt-1 py-1 text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer border-none outline-none select-none"
            onClick={handleCopy}
            title="Click to copy command"
          >
            <code className="font-mono text-[0.72rem] select-all truncate max-w-[90%] text-white/40 group-hover/card:text-white/60 transition-colors">
              $ {block.installCmd}
            </code>
            <button
              type="button"
              className="text-[var(--muted-foreground)] hover:text-white transition-colors cursor-pointer flex-shrink-0 border-none outline-none bg-transparent p-0"
              style={{ outline: "none" }}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-40 group-hover/card:opacity-75 transition-opacity" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
