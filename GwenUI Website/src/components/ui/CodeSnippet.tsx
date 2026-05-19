"use client";

import { useState, useId } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CodeTab {
  id: string;
  icon?: React.ReactNode | string;
  language?: string;
  code: string;
  highlightedCode?: React.ReactNode;
}

interface CodeSnippetProps {
  title?: string;
  tabs: CodeTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
}

export function CodeSnippet({
  title,
  tabs,
  activeTabId,
  onTabChange,
}: CodeSnippetProps) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id);
  const [copied, setCopied] = useState(false);
  const uid = useId();

  const activeId = activeTabId !== undefined ? activeTabId : internalTab;
  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  const handleTabChange = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setInternalTab(id);
    }
  };

  const copyToClipboard = () => {
    if (!activeTab) return;
    navigator.clipboard.writeText(activeTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeTab) return null;

  return (
    <div className="flex flex-col w-full my-6">
      {/* Title rendered above the code block layout */}
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]/60 mb-3">
          {title}
        </h3>
      )}

      {/* CodeSnippet Outer Frame */}
      <div className="rounded-xl border border-[var(--docs-border-faint)] bg-[var(--docs-card-bg)]/80 backdrop-blur-md overflow-hidden w-full flex flex-col shadow-lg">
        
        {/* Header Tab Bar containing segmented switches with dividers */}
        <div className="flex items-center justify-between border-b border-[var(--docs-border-faint)]/80 bg-[var(--background)]/40 shrink-0">
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-5 py-3 border-r border-[var(--docs-border-faint)]/60 text-[11px] font-mono cursor-pointer transition-colors duration-200 flex items-center gap-2 select-none relative shrink-0 border-none outline-none ${
                    isActive
                      ? "text-[var(--primary)] font-extrabold"
                      : "text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)]"
                  }`}
                  style={{
                    background: "transparent",
                    outline: "none",
                  }}
                >
                  {/* Sliding Active Tab Background & Bottom Orange Bar */}
                  {isActive && (
                    <motion.div
                      layoutId={`active-snippet-bg-${uid}`}
                      className="absolute inset-0 bg-[var(--background)]/45 shadow-[inset_0_-2px_0_var(--primary)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {tab.icon && <span className="opacity-70 relative z-10">{tab.icon}</span>}
                  <span className="relative z-10">{tab.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Display Container with Floating Copy Button */}
        <div className="relative group w-full bg-[var(--background)]/50 p-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 3, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -3, scale: 0.995 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="font-mono text-xs overflow-auto text-[var(--foreground)]/85 max-h-[380px] custom-scrollbar w-full"
            >
              {activeTab.highlightedCode ? (
                activeTab.highlightedCode
              ) : (
                <pre className="whitespace-pre">
                  <code>{activeTab.code}</code>
                </pre>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Floating Copy Button (Fades in dynamically on hover of the code area) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg border border-[var(--docs-border-faint)] bg-[var(--docs-card-bg)]/90 hover:bg-[var(--docs-elem-hover)] text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] transition-all duration-200 opacity-60 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center shadow-lg cursor-pointer"
              title="Copy code"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--success)] font-bold px-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { CodeSnippetProps };
