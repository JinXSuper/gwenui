"use client"

import React from "react"
import { useTheme } from "next-themes"
import { Code2, RotateCcw, Sun, Moon, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface PreviewToolbarProps {
  isSourceOpen:   boolean
  hasSource:      boolean
  onSourceToggle: () => void
  onRefresh:      () => void
  className?:     string
}

const ToolbarBtn: React.FC<{
  onClick:   () => void
  active?:   boolean
  disabled?: boolean
  title:     string
  children:  React.ReactNode
}> = ({ onClick, active, disabled, title, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "w-7 h-7 rounded-md flex items-center justify-center transition-all outline-none border-none shrink-0 select-none",
      disabled
        ? "cursor-not-allowed opacity-30 text-[var(--docs-text-muted)]"
        : cn(
            "cursor-pointer",
            active
              ? "bg-[var(--docs-text-heading)]/10 text-[var(--docs-text-heading)]"
              : "text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)]"
          )
    )}
  >
    {children}
  </button>
)

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  isSourceOpen,
  hasSource,
  onSourceToggle,
  onRefresh,
  className,
}) => {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 h-10 shrink-0 select-none",
        "border-b border-[var(--docs-border-faint)] bg-[var(--docs-card-bg)]",
        className
      )}
    >
      {/* Left — block label */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--docs-text-faint)]/30" />
        <span className="text-[11px] font-mono text-[var(--docs-text-muted)] tracking-wide">
          Preview
        </span>
      </div>

      {/* Right — action buttons */}
      <div className="flex items-center gap-0.5">
        <ToolbarBtn
          onClick={onSourceToggle}
          active={isSourceOpen}
          disabled={!hasSource}
          title={
            !hasSource
              ? "No source available"
              : isSourceOpen
                ? "Close source"
                : "View source"
          }
        >
          <Code2 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <ToolbarBtn onClick={onRefresh} title="Refresh preview">
          <RotateCcw className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <ToolbarBtn
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title={isDark ? "Switch to light" : "Switch to dark"}
        >
          {isDark
            ? <Sun className="w-3.5 h-3.5 text-amber-500" />
            : <Moon className="w-3.5 h-3.5 text-indigo-400" />
          }
        </ToolbarBtn>
      </div>
    </div>
  )
}
