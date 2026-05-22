"use client"

import React, { useState, useRef, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { PreviewToolbar } from "./PreviewToolbar"
import { PreviewProperty, PreviewProperties } from "./PreviewProperties"

export interface SourceFile {
  name:      string
  content:   string
  path?:     string
  language?: string
}

export interface PreviewPanelProps {
  src:             string
  properties?:     PreviewProperty[]
  sourceFiles?:    SourceFile[]   // kept for type compat, not used directly
  // Injected by DocsSplitLayout via cloneElement
  isSourceOpen?:   boolean
  hasSource?:      boolean
  onSourceToggle?: () => void
  className?:      string
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  src,
  properties,
  isSourceOpen = false,
  hasSource = false,
  onSourceToggle,
  className,
}) => {
  const { resolvedTheme } = useTheme()
  const [activeProperty, setActiveProperty] = useState<string>(
    properties?.[0]?.value ?? "default"
  )
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const previewTheme = resolvedTheme === "light" ? "light" : "dark"

  const iframeSrc = useMemo(() => {
    try {
      const url = new URL(
        src,
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
      )
      url.searchParams.set("variant", activeProperty)
      url.searchParams.set("theme", previewTheme)
      return url.toString()
    } catch {
      return `${src}?variant=${activeProperty}&theme=${previewTheme}`
    }
  }, [src, activeProperty, previewTheme])

  const handleRefresh = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }, [])

  return (
    <div
      className={cn(
        "w-full h-full min-h-0 flex flex-col rounded-2xl overflow-hidden",
        "border border-[var(--docs-border-faint)] bg-[var(--docs-card-bg)] shadow-2xl",
        className
      )}
    >
      {/* Top toolbar */}
      <PreviewToolbar
        isSourceOpen={isSourceOpen}
        hasSource={hasSource}
        onSourceToggle={onSourceToggle ?? (() => {})}
        onRefresh={handleRefresh}
      />

      {/* Preview iframe */}
      <div className="relative flex-1 min-h-0 w-full bg-[var(--preview-bg)] overflow-hidden">
        <iframe
          key={iframeSrc}
          ref={iframeRef}
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0 bg-transparent"
          title="Component preview"
        />

        {properties && properties.length > 0 && (
          <PreviewProperties
            variant="overlay"
            className="absolute bottom-4 right-4 z-20"
            properties={properties}
            active={activeProperty}
            onChange={setActiveProperty}
          />
        )}
      </div>
    </div>
  )
}

export default PreviewPanel
