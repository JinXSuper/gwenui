"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface BlockPreviewProps {
  block: string        // block name dari registry
  height?: number      // default: 500
  className?: string
}

export function BlockPreview({
  block,
  height = 500,
  className,
}: BlockPreviewProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("w-full rounded-xl overflow-hidden border border-[--border] bg-[--bg]", className)}>
      {/* Tab Bar */}
      <div className="btn-shadow-group flex items-center gap-1 px-4 py-2 border-b border-[--border] bg-[--surface]">
        <button
          onClick={() => setTab("preview")}
          className={cn(
            "px-3 py-1 rounded-md text-xs font-medium transition-all",
            tab === "preview"
              ? "bg-[--primary]/10 text-[--primary]"
              : "text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)]"
          )}
        >
          Preview
        </button>
        <button
          onClick={() => setTab("code")}
          className={cn(
            "px-3 py-1 rounded-md text-xs font-medium transition-all",
            tab === "code"
              ? "bg-[--primary]/10 text-[--primary]"
              : "text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)]"
          )}
        >
          Code
        </button>
      </div>

      {/* Preview */}
      {tab === "preview" && (
        <div className="relative w-full" style={{ height }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[--bg] z-10">
              <div className="w-6 h-6 border-2 border-[--primary]/30 border-t-[--primary] rounded-full animate-spin" />
            </div>
          )}
          <iframe
            src={`/preview/${block}`}
            style={{ height: "100%", width: "100%" }}
            className={cn("w-full border-none bg-[--bg] transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )}

      {tab === "code" && (
        <div className="p-4 text-[var(--docs-text-muted)] text-sm overflow-y-auto" style={{ height }}>
          Code view coming soon...
        </div>
      )}
    </div>
  )
}
