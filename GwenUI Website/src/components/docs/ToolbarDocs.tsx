"use client";

import { motion } from "framer-motion";
import { Eye, Code2, RotateCcw, Check, Copy } from "lucide-react";

interface ToolbarDocsProps {
  view: "preview" | "code";
  setView: (view: "preview" | "code") => void;
  deviceMode: "desktop" | "tablet" | "mobile";
  setDeviceMode: (device: "desktop" | "tablet" | "mobile") => void;
  isLandscape: boolean;
  setIsLandscape: (isLandscape: boolean) => void;
  isRefreshing: boolean;
  handleRefresh: () => void;
  blockName: string;
  copiedCommand: boolean;
  handleCopyCommand: () => void;
  layoutIdPrefix?: string;
}

export function ToolbarDocs({
  view,
  setView,
  deviceMode,
  setDeviceMode,
  isLandscape,
  setIsLandscape,
  isRefreshing,
  handleRefresh,
  blockName,
  copiedCommand,
  handleCopyCommand,
  layoutIdPrefix = "",
}: ToolbarDocsProps) {
  return (
    <div className="absolute top-8 left-8 right-8 z-50 flex items-center justify-between gap-4 select-none pointer-events-auto">
      {/* LEFT — Preview/Code Toggle (Pill Group, Dark BG) */}
      <div className="flex items-center bg-[var(--docs-card-bg)]/60 backdrop-blur-xl rounded-full p-1 border border-[var(--docs-border-strong)] shadow-xl shrink-0">
        {[
          { id: "preview", label: "Preview", icon: <Eye size={14} /> },
          { id: "code", label: "Code", icon: <Code2 size={14} /> }
        ].map((tab) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 select-none relative"
              style={{
                color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId={`${layoutIdPrefix}activeViewTab`}
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: "var(--active-glass)",
                    border: "1px solid var(--active-glass-border)",
                    zIndex: 0,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* CENTER — Device + Orientation Toggle (Pill Group, Dark BG) */}
      <div className="flex items-center bg-[var(--docs-card-bg)]/60 backdrop-blur-xl rounded-full p-1 border border-[var(--docs-border-strong)] shadow-xl">
        {[
          {
            id: "desktop",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ),
          },
          {
            id: "tablet",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            ),
          },
          {
            id: "mobile",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            ),
          },
        ].map((device) => {
          const isActive = deviceMode === device.id;
          return (
            <button
              key={device.id}
              onClick={() => {
                setDeviceMode(device.id as any);
                setIsLandscape(false);
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 select-none relative"
              style={{
                color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId={`${layoutIdPrefix}activeDeviceTab`}
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: "var(--active-glass)",
                    border: "1px solid var(--active-glass-border)",
                    zIndex: 0,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {device.icon}
                <span className="capitalize">{device.id}</span>
              </span>
            </button>
          );
        })}

        <div className="w-[1px] h-4 bg-[var(--docs-border-faint)] mx-1" />

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="p-1.5 px-3 text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)] rounded-full transition-all flex items-center justify-center relative z-10"
          title="Reload Preview"
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.div>
        </button>

        {deviceMode !== "desktop" && (
          <>
            <div className="w-[1px] h-4 bg-[var(--docs-border-faint)] mx-1" />
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="p-1.5 px-3 rounded-full transition-all flex items-center justify-center relative z-10"
              style={{
                backgroundColor: isLandscape ? "var(--active-glass)" : "transparent",
                border: isLandscape ? "1px solid var(--active-glass-border)" : "1px solid transparent",
                color: isLandscape ? "var(--foreground)" : "var(--muted-foreground)"
              }}
              title="Rotate Orientation"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="5"
                  y="2"
                  width="14"
                  height="20"
                  rx="2"
                  ry="2"
                  className={`transition-transform duration-300 origin-center ${
                    isLandscape ? "-rotate-90 scale-90" : "rotate-0"
                  }`}
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* RIGHT — Copy Snippet (Pill Group, Dark BG, Monospace, matching root docs exactly) */}
      <button
        onClick={handleCopyCommand}
        className="flex items-center gap-2.5 px-4 py-1.5 bg-[var(--docs-card-bg)]/60 backdrop-blur-xl rounded-full border border-[var(--docs-border-strong)] shadow-xl transition-all text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)] shrink-0 z-10"
        title="Copy Installation Command"
      >
        <span className="font-mono text-[13px] tracking-wide flex items-center relative z-10">
          <span className="text-[var(--docs-text-dim)] mr-1.5">$</span>
          npx @gwenui/cli add {blockName}
        </span>
        <div className="flex items-center justify-center text-[var(--docs-text-faint)] relative z-10">
          {copiedCommand ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="opacity-70" />
          )}
        </div>
      </button>
    </div>
  );
}
