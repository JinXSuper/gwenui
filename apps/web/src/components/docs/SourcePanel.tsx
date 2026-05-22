"use client"

import React, { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronLeft, FileCode, Copy, Check } from "lucide-react"
import type { SourceFile } from "./PreviewPanel"

interface SourcePanelProps {
  sourceFiles: SourceFile[]
  onClose:     () => void
  className?:  string
}

/* ─── Token-based syntax highlighter (no double-replacement) ── */
type Token = { type: "comment" | "keyword" | "hook" | "string" | "type" | "number" | "fn" | "plain"; text: string }

function tokenizeLine(line: string): Token[] {
  // Full-line comment
  const trimmed = line.trimStart()
  if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return [{ type: "comment", text: line }]
  }

  const tokens: Token[] = []
  let i = 0

  const KEYWORDS = /^(const|let|var|function|return|import|export|default|from|interface|type|extends|as|true|false|null|undefined|string|number|boolean|any|void|async|await|if|else|for|while|class|new|this|typeof|instanceof|in|of|try|catch|finally|throw|switch|case|break|continue)\b/
  const HOOKS    = /^(useState|useEffect|useRef|useMemo|useCallback|useContext|useReducer|useMotionValue|useSpring|useTransform|useVelocity|useTheme)\b/
  const TYPES    = /^([A-Z][a-zA-Z0-9_]*)\b/
  const NUMBERS  = /^(\d+\.?\d*)\b/
  const IDENT    = /^([a-zA-Z_$][a-zA-Z0-9_$]*)/

  while (i < line.length) {
    const rest = line.slice(i)

    // String: double-quoted
    if (rest[0] === '"') {
      const end = rest.indexOf('"', 1)
      const str = end === -1 ? rest : rest.slice(0, end + 1)
      tokens.push({ type: "string", text: str })
      i += str.length
      continue
    }
    // String: single-quoted
    if (rest[0] === "'") {
      const end = rest.indexOf("'", 1)
      const str = end === -1 ? rest : rest.slice(0, end + 1)
      tokens.push({ type: "string", text: str })
      i += str.length
      continue
    }
    // Template literal
    if (rest[0] === "`") {
      const end = rest.indexOf("`", 1)
      const str = end === -1 ? rest : rest.slice(0, end + 1)
      tokens.push({ type: "string", text: str })
      i += str.length
      continue
    }

    // Number
    const numM = rest.match(NUMBERS)
    if (numM && (i === 0 || !/[a-zA-Z_$]/.test(line[i - 1]))) {
      tokens.push({ type: "number", text: numM[1] })
      i += numM[1].length
      continue
    }

    // Identifier — check keyword/hook/type/fn
    const identM = rest.match(IDENT)
    if (identM) {
      const word = identM[1]
      if (HOOKS.test(word)) {
        tokens.push({ type: "hook", text: word })
      } else if (KEYWORDS.test(word)) {
        tokens.push({ type: "keyword", text: word })
      } else if (TYPES.test(word)) {
        // Check if followed by ( → function call with PascalCase
        const after = rest.slice(word.length).trimStart()
        tokens.push({ type: "type", text: word })
      } else {
        // Check if followed by ( → function call
        const after = line.slice(i + word.length).trimStart()
        if (after[0] === "(") {
          tokens.push({ type: "fn", text: word })
        } else {
          tokens.push({ type: "plain", text: word })
        }
      }
      i += word.length
      continue
    }

    // Plain character
    tokens.push({ type: "plain", text: rest[0] })
    i++
  }

  return tokens
}

const TOKEN_COLORS: Record<Token["type"], string> = {
  comment: "#6272a4",
  keyword: "#ff79c6",
  hook:    "#ffb86c",
  string:  "#50fa7b",
  type:    "#bd93f9",
  fn:      "#8be9fd",
  number:  "#f1fa8c",
  plain:   "#f8f8f2",
}

function renderLine(line: string, idx: number): React.ReactNode {
  const tokens = tokenizeLine(line)
  const isComment = tokens.length === 1 && tokens[0].type === "comment"

  return (
    <div key={idx} className="table-row">
      <span className="table-cell select-none text-right pr-4 w-10 text-[10px] font-mono leading-relaxed"
        style={{ color: "rgba(255,255,255,0.12)" }}>
        {idx + 1}
      </span>
      <span className={cn("table-cell whitespace-pre font-mono leading-relaxed", isComment && "italic")}
        style={{ color: isComment ? "#6272a4" : undefined }}>
        {isComment
          ? tokens[0].text
          : tokens.map((tok, j) => (
              <span key={j} style={{ color: TOKEN_COLORS[tok.type] }}>{tok.text}</span>
            ))
        }
      </span>
    </div>
  )
}

/* ─── Component ─────────────────────────────────────────── */
export const SourcePanel: React.FC<SourcePanelProps> = ({
  sourceFiles,
  onClose,
  className,
}) => {
  const [activeFile, setActiveFile] = useState(sourceFiles[0]?.name ?? "")
  const [copied, setCopied] = useState(false)

  const activeContent = sourceFiles.find((f) => f.name === activeFile)?.content ?? ""
  const lines = useMemo(() => activeContent.split("\n"), [activeContent])

  const handleCopy = useCallback(async () => {
    if (!activeContent) return
    try {
      await navigator.clipboard.writeText(activeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* unavailable */ }
  }, [activeContent])

  return (
    <div
      className={cn("flex flex-col h-full min-h-0 overflow-hidden", className)}
      style={{ background: "#0d0d10" }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 h-10 border-b border-white/5 shrink-0 select-none"
        style={{ background: "#111114" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 hover:text-white/90 transition-colors cursor-pointer border-none bg-transparent outline-none shrink-0 tracking-wide"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Source Code
        </button>

        {/* File tabs */}
        {sourceFiles.length > 1 && (
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar flex-1">
            {sourceFiles.map((file) => (
              <button
                key={file.name}
                onClick={() => setActiveFile(file.name)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer border-none outline-none shrink-0",
                  activeFile === file.name
                    ? "font-semibold"
                    : "text-white/30 hover:text-white/70"
                )}
                style={
                  activeFile === file.name
                    ? { color: "var(--primary)", background: "color-mix(in srgb, var(--primary) 12%, transparent)" }
                    : { background: "transparent" }
                }
              >
                {file.name}
              </button>
            ))}
          </div>
        )}

        {/* Filename + copy — right */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <span className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
            <FileCode className="w-3.5 h-3.5" />
            {activeFile}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] font-medium cursor-pointer border-none bg-transparent outline-none transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span key="check" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 text-green-400">
                  <Check className="w-3.5 h-3.5" /> Copied
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Code viewer ── */}
      <div
        className="flex-1 min-h-0 overflow-auto p-5 custom-scrollbar select-text"
        style={{ background: "#0d0d10" }}
      >
        <div className="table w-full border-collapse font-mono text-[12px] leading-relaxed">
          {lines.map((line, idx) => renderLine(line, idx))}
        </div>
      </div>
    </div>
  )
}
