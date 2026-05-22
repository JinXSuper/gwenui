"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface PreviewProperty {
  label: string
  value: string
}

interface PreviewPropertiesProps {
  properties: PreviewProperty[]
  active:     string
  onChange:   (value: string) => void
  className?: string
  variant?:   "footer" | "overlay"
}

export const PreviewProperties: React.FC<PreviewPropertiesProps> = ({
  properties,
  active,
  onChange,
  className,
  variant = "footer",
}) => (
  <div
    className={cn(
      "pointer-events-auto flex items-center justify-start gap-2 flex-wrap select-none",
      variant === "footer" &&
        "px-4 py-3 border-t border-[var(--docs-border-faint)] shrink-0 bg-[var(--docs-elem-surface)]/10",
      variant === "overlay" &&
        "btn-shadow-group px-1.5 py-1.5 rounded-full border border-[var(--docs-border-faint)] bg-[var(--docs-card-bg)]/90 backdrop-blur-md",
      className
    )}
  >
    {properties.map(({ label, value }) => (
      <button
        key={value}
        onClick={() => onChange(value)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all cursor-pointer outline-none border",
          active === value
            ? "bg-[var(--docs-text-heading)] text-[var(--docs-page-bg)] border-transparent"
            : "border-[var(--docs-border)] text-[var(--docs-text-body)] hover:text-[var(--docs-text-heading)] hover:border-[var(--docs-border-strong)] bg-[var(--docs-elem-surface)]/50"
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            active === value ? "bg-[var(--docs-page-bg)]" : "bg-[var(--docs-text-faint)]"
          )}
        />
        {label}
      </button>
    ))}
  </div>
)
