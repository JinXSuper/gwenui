"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolbarDocs } from "./ToolbarDocs";
import { VirtualIDE, VirtualIDEFile } from "./VirtualIDE";

export interface PreviewToolbarProps {
  blockName: string;
  iframeSrc: string;
  defaultView?: "preview" | "code";
  codeContent?: string;
  codeUrl?: string;
  files?: VirtualIDEFile[];
}

export function PreviewToolbar({
  blockName,
  iframeSrc,
  defaultView = "preview",
  codeContent,
  codeUrl,
  files
}: PreviewToolbarProps) {
  const [view, setView] = useState<"preview" | "code">(defaultView);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLandscape, setIsLandscape] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchedCode, setFetchedCode] = useState<string>("");
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch code at runtime if codeUrl is provided
  useEffect(() => {
    if (codeUrl && !codeContent) {
      setIsLoadingCode(true);
      fetch(codeUrl)
        .then((res) => res.text())
        .then((text) => {
          setFetchedCode(text);
          setIsLoadingCode(false);
        })
        .catch(() => {
          setFetchedCode("// Failed to fetch source code from GitHub.");
          setIsLoadingCode(false);
        });
    }
  }, [codeUrl, codeContent]);

  const activeCode = codeContent || fetchedCode || "// No source code provided.";

  // Copy command helper
  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(`npx @gwenui/cli add ${blockName}`);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch (err) {
      console.error("Failed to copy command", err);
    }
  };

  // Copy code helper
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  // Refresh iframe handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    if (iframeRef.current) {
      iframeRef.current.style.opacity = "0.3";
      iframeRef.current.src = iframeRef.current.src;
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.style.opacity = "1";
        }
      }, 250);
    }
    setTimeout(() => setIsRefreshing(false), 600); // end rotate animation
  };

  // Calculate dynamic dimensions for device frame based on portrait/landscape state
  const getViewportDimensions = () => {
    if (deviceMode === "desktop") {
      return { width: "100%", height: "100%" };
    }
    if (deviceMode === "tablet") {
      return {
        width: isLandscape ? "768px" : "512px",
        height: isLandscape ? "512px" : "680px",
      };
    }
    // Mobile mode
    return {
      width: isLandscape ? "640px" : "320px",
      height: isLandscape ? "320px" : "568px",
    };
  };

  const currentDimensions = getViewportDimensions();

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden bg-[var(--docs-page-bg)]/20 font-sans">
      <ToolbarDocs
        view={view}
        setView={setView}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        isLandscape={isLandscape}
        setIsLandscape={setIsLandscape}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        blockName={blockName}
        copiedCommand={copiedCommand}
        handleCopyCommand={handleCopyCommand}
        layoutIdPrefix="previewToolbar_"
      />

      {/* Content Canvas */}
      <div className="flex-1 w-full relative overflow-hidden bg-transparent">
        <AnimatePresence mode="wait">
          {view === "preview" ? (
            /* PREVIEW SIMULATOR WORKSPACE */
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center relative overflow-y-auto overflow-x-hidden p-8 pt-24"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  width: currentDimensions.width,
                  height: currentDimensions.height,
                }}
                className={`relative overflow-hidden shadow-3xl bg-[var(--docs-page-bg)] transition-all duration-[600ms] ${
                  deviceMode === "desktop"
                    ? "w-full h-full rounded-3xl border border-[var(--docs-border-faint)]"
                    : deviceMode === "tablet"
                    ? "rounded-[2rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl"
                    : "rounded-[2.8rem] border-[12px] border-[var(--docs-card-bg)] ring-1 ring-[var(--docs-border)] shadow-2xl"
                }`}
              >
                {/* Notch for Mobile Portrait */}
                {deviceMode === "mobile" && !isLandscape && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-[var(--docs-card-bg)] rounded-full z-30 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]/20 mr-2 ring-1 ring-[var(--docs-border-faint)]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--docs-page-bg)]" />
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  scrolling="no"
                  className="w-full h-full border-0 transition-opacity duration-300 bg-transparent overflow-hidden"
                  title={`${blockName} Mockup`}
                />
              </motion.div>
            </motion.div>
          ) : (
            /* SOURCE CODE VIEWPORT */
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col overflow-hidden bg-[var(--docs-card-bg)] pt-20 px-6 pb-6"
            >
              {files && files.length > 0 ? (
                <div className="flex-1 w-full h-full overflow-hidden [&>div]:my-0 [&>div]:h-full">
                  <VirtualIDE 
                    files={files} 
                    height={550} 
                    title={`${blockName} workspace`}
                  />
                </div>
              ) : (
                <>
                  <div className="px-6 py-3 border-b border-[var(--docs-border-faint)] bg-black/40 flex items-center justify-between shrink-0 select-none">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      <span className="text-xs font-mono text-[var(--docs-text-body)] font-bold">{blockName}-form.tsx</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="text-[11px] font-bold uppercase tracking-wider text-[var(--docs-text-body)] hover:text-[var(--docs-text-heading)] transition-colors flex items-center gap-1.5"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-[1.7] text-[var(--docs-text-body)] custom-scrollbar">
                    {isLoadingCode ? (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-white/40">
                        <RotateCcw className="w-5 h-5 animate-spin" />
                        <span>Fetching source code from GitHub...</span>
                      </div>
                    ) : (
                      <pre className="whitespace-pre tab-size-2 select-text">
                        <code>{activeCode}</code>
                      </pre>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
