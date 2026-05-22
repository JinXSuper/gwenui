"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RotateCcw, Search, Code2, Maximize2, Minimize2, Sun, Moon, ChevronLeft } from "lucide-react";
import { PreviewProperties, PreviewProperty } from "./PreviewProperties";
import { cn } from "@/lib/utils";

export interface VirtualIDEFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface PreviewToolbarProps {
  blockName: string;
  iframeSrc: string;
  defaultView?: "preview" | "code";
  codeContent?: string;
  codeUrl?: string;
  files?: VirtualIDEFile[];
  properties?: PreviewProperty[];
  className?: string;
  sourceFile?: string;
}

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, active, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer outline-none border-none bg-transparent select-none",
      "text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)]",
      active && "text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15"
    )}
  >
    {children}
  </button>
);

export function PreviewToolbar({
  blockName,
  iframeSrc,
  defaultView = "preview",
  codeContent,
  codeUrl,
  files,
  properties,
  className,
  sourceFile,
}: PreviewToolbarProps) {
  const [view, setView] = useState<"preview" | "code">(defaultView);
  const [activeProperty, setActiveProperty] = useState<string>(
    properties?.[0]?.value ?? "default"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copiedCode, setCopiedCode] = useState(false);
  const [fetchedCode, setFetchedCode] = useState<string>("");
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Manage multi-file source tabs
  const [activeFileName, setActiveFileName] = useState<string>(sourceFile || `${blockName}.tsx`);
  const [activeFileContent, setActiveFileContent] = useState<string>("");

  // Fetch code at runtime if codeUrl is provided
  useEffect(() => {
    if (codeUrl && !codeContent) {
      setIsLoadingCode(true);
      fetch(codeUrl)
        .then((res) => res.text())
        .then((text) => {
          // If fetched text is html (like from github tree), replace with simple fallback
          if (text.trim().startsWith("<!DOCTYPE html>") || text.includes('{"payload":')) {
            setFetchedCode("// Source code resides inside git repository blocks folder.");
          } else {
            setFetchedCode(text);
          }
          setIsLoadingCode(false);
        })
        .catch(() => {
          setFetchedCode("// Failed to fetch source code.");
          setIsLoadingCode(false);
        });
    }
  }, [codeUrl, codeContent]);

  const activeCode = codeContent || fetchedCode || "// No source code provided.";

  // Sync active file content
  useEffect(() => {
    if (files && files.length > 0) {
      const current = files.find(f => f.name === activeFileName) || files[0];
      setActiveFileName(current.name);
      setActiveFileContent(current.content);
    } else {
      setActiveFileName(sourceFile || `${blockName}.tsx`);
      setActiveFileContent(activeCode);
    }
  }, [files, activeCode, activeFileName, sourceFile, blockName]);

  // Build dynamic iframe src with active variant + theme
  const dynamicIframeSrc = useMemo(() => {
    try {
      const url = new URL(iframeSrc, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
      url.searchParams.set("variant", activeProperty);
      url.searchParams.set("theme", theme);
      return url.toString();
    } catch (e) {
      return `${iframeSrc}?variant=${activeProperty}&theme=${theme}`;
    }
  }, [iframeSrc, activeProperty, theme]);

  const handleRefresh = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Lock body scroll & Escape key when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFullscreen(false);
      };
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isFullscreen]);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeFileContent);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {}
  }, [activeFileContent]);

  // Display Name Helper
  const displayName = useMemo(() => {
    return blockName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [blockName]);

  // Custom regex client-side syntax highlighter
  const syntaxHighlight = useCallback((code: string) => {
    if (!code) return [];

    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    };

    const lines = code.split("\n");
    return lines.map((line, idx) => {
      let escapedLine = escapeHtml(line);

      // Comments
      if (line.trim().startsWith("//") || line.trim().startsWith("/*")) {
        return (
          <div key={idx} className="table-row">
            <span className="table-cell select-none text-[var(--docs-text-muted)]/20 text-right pr-4 w-10 text-[10px] font-mono leading-relaxed">{idx + 1}</span>
            <span className="table-cell text-zinc-500/80 italic whitespace-pre leading-relaxed">{line}</span>
          </div>
        );
      }

      // Keywords
      escapedLine = escapedLine.replace(
        /\b(const|let|var|function|return|import|export|default|from|interface|type|extends|as|true|false|null|undefined|string|number|boolean|any|void|async|await)\b/g,
        `<span class="text-[#ff79c6] font-medium">$1</span>`
      );

      // React hooks & custom states
      escapedLine = escapedLine.replace(
        /\b(useState|useEffect|useRef|useMemo|useCallback|useContext|useMotionValue|useSpring|useTransform)\b/g,
        `<span class="text-[#ffb86c] font-medium">$1</span>`
      );

      // Strings
      escapedLine = escapedLine.replace(
        /(&quot;[\s\S]*?&quot;|&#x27;[\s\S]*?&#x27;|`[\s\S]*?`)/g,
        `<span class="text-[#50fa7b]">$1</span>`
      );

      // Function calls
      escapedLine = escapedLine.replace(
        /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g,
        `<span class="text-[#8be9fd]">$1</span>`
      );

      // Types & Classes
      escapedLine = escapedLine.replace(
        /\b([A-Z][a-zA-Z0-9_]*)\b/g,
        `<span class="text-[#bd93f9]">$1</span>`
      );

      return (
        <div key={idx} className="table-row">
          <span className="table-cell select-none text-[var(--docs-text-muted)]/20 text-right pr-4 w-10 text-[10px] font-mono leading-relaxed">{idx + 1}</span>
          <span
            className="table-cell whitespace-pre font-mono leading-relaxed text-[#f8f8f2]/90"
            dangerouslySetInnerHTML={{ __html: escapedLine }}
          />
        </div>
      );
    });
  }, []);

  const renderSourceView = () => {
    return (
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#09090b]">
        {/* Code Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/30 select-none bg-[var(--docs-elem-surface)]/20 shrink-0 h-[44px]">
          <button
            onClick={() => setView("preview")}
            className="text-[11px] font-bold text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--docs-text-muted)] font-semibold">
            <span>{activeFileName}</span>
            <button
              onClick={handleCopyCode}
              className="text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] transition-all cursor-pointer bg-transparent border-none outline-none"
              title="Copy Code"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Multi-file source tabs selection if files exist */}
        {files && files.length > 1 && (
          <div className="flex items-center gap-1 border-b border-border/20 px-3 py-1.5 bg-black/40 overflow-x-auto no-scrollbar shrink-0 select-none">
            {files.map((file) => {
              const isActive = file.name === activeFileName;
              return (
                <button
                  key={file.path}
                  onClick={() => {
                    setActiveFileName(file.name);
                    setActiveFileContent(file.content);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer border-none outline-none",
                    isActive
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                      : "text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-white/5"
                  )}
                >
                  {file.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Code Viewer Panel */}
        <div className="flex-1 overflow-auto bg-[#09090b]/80 p-6 select-text custom-scrollbar font-mono text-xs leading-relaxed text-[var(--docs-text-body)] relative">
          {isLoadingCode ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40 select-none bg-[#09090b]">
              <RotateCcw className="w-5 h-5 animate-spin" />
              <span>Fetching source code...</span>
            </div>
          ) : (
            <div className="table w-full border-collapse font-mono text-[12px] leading-relaxed select-text">
              {syntaxHighlight(activeFileContent)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const panelContent = (
    <div className={cn(
      "flex-1 flex overflow-hidden min-h-0",
      view === "code" ? "flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/30" : "flex-col"
    )}>
      {/* Code Viewer Column */}
      {view === "code" && renderSourceView()}

      {/* Live Preview Column */}
      <div className="flex-1 flex flex-col h-full bg-[#0a0a0c]">
        {/* Preview Header */}
        <div className="flex items-center justify-between lg:justify-end gap-1 px-3 py-2 border-b border-border/30 select-none bg-[var(--docs-elem-surface)]/20 shrink-0 h-[44px]">
          {/* Top-left Doc Title inside fullscreen or single view */}
          {(view === "preview" || isFullscreen) && (
            <span className="mr-auto text-[11px] text-[var(--docs-text-muted)] font-mono flex items-center gap-1.5 font-semibold">
              <svg className="w-4 h-4 text-[var(--docs-text-muted)]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
              <span className="text-[var(--docs-text-dim)]">Docs</span>
              <span className="text-[var(--docs-text-dim)]/40">•</span>
              <span className="text-[var(--docs-text-heading)]">{displayName}</span>
            </span>
          )}

          <div className="flex items-center gap-1">
            <ToolbarButton onClick={() => {}} title="Search">
              <Search className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => setView((v) => (v === "preview" ? "code" : "preview"))}
              active={view === "code"}
              title={view === "code" ? "Hide source" : "View source"}
            >
              <Code2 className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarButton onClick={handleRefresh} title="Refresh">
              <RotateCcw className="w-3.5 h-3.5" />
            </ToolbarButton>

            <ToolbarButton onClick={handleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </ToolbarButton>

            <ToolbarButton onClick={handleThemeToggle} title="Toggle theme">
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            </ToolbarButton>
          </div>
        </div>

        {/* Live Preview Frame Area */}
        <div className="flex-1 relative min-h-[360px] bg-transparent">
          <iframe
            ref={iframeRef}
            src={dynamicIframeSrc}
            className="w-full h-full border-0 absolute inset-0 bg-transparent"
            title={`${blockName} Preview`}
          />
        </div>

        {/* Properties (Pills Swapper) */}
        {properties && properties.length > 0 && (
          <PreviewProperties
            properties={properties}
            active={activeProperty}
            onChange={setActiveProperty}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Fullscreen backdrop — fades in/out */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key="preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-lg"
            onClick={() => setIsFullscreen(false)}
          />
        )}
      </AnimatePresence>

      {/* Single card — morphs between inline and fullscreen */}
      <div
        className={cn(
          isFullscreen
            ? "fixed inset-0 z-[999] p-6 flex flex-col pointer-events-none"
            : "w-full h-full p-6 bg-transparent flex flex-col relative overflow-hidden"
        )}
      >
        <motion.div
          layout
          transition={{
            layout: {
              type: "spring",
              stiffness: 300,
              damping: 32,
              mass: 0.8,
            },
          }}
          className={cn(
            "rounded-2xl border overflow-hidden flex flex-col pointer-events-auto",
            isFullscreen
              ? "flex-1 border-border/40 bg-[#070708]/95 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.6)]"
              : "flex-1 border-[var(--docs-border-faint)] bg-[#070708]/90 backdrop-blur-xl shadow-2xl",
            className
          )}
        >
          {panelContent}
        </motion.div>
      </div>
    </>
  );
}

export default PreviewToolbar;
