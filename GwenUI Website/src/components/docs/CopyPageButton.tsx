'use client'
import { useState, useRef, useEffect } from 'react'
import { Check, Copy, ChevronDown } from 'lucide-react'
import { SiClaude } from '@icons-pack/react-simple-icons'

export function CopyPageButton() {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getPageText = () => {
    const el = document.querySelector('[data-mdx-content]') as HTMLElement | null
    const text = el?.innerText ?? ''
    
    const clean = text
      .replace(/^(Copy Page|Copy as Markdown|Open in Claude|#)\n/gm, '')
      .trim()
      
    return clean
  }

  const handleCopy = async () => {
    const text = getPageText()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setOpen(false)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenInClaude = () => {
    const text = getPageText()
    const truncated = text.length > 2000
      ? text.slice(0, 2000) + '\n\n[Full docs: gwenui.vercel.app]'
      : text

    const encoded = encodeURIComponent(
      `Context from GwenUI docs:\n\n${truncated}`
    )
    window.open(`https://claude.ai/new?q=${encoded}`, '_blank')
    setOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <div className="flex items-center h-8 rounded-md bg-[var(--surface)] border border-[var(--docs-border-faint)] text-[13px] font-medium text-[var(--docs-text-heading)] transition-colors group shadow-[var(--shadow-tier-1)]">
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 h-full hover:bg-[var(--docs-elem-hover)] rounded-l-md transition-colors"
          title="Copy page content"
        >
          {copied ? (
            <Check size={14} className="text-[var(--primary)]" />
          ) : (
            <Copy size={14} className="text-[var(--docs-text-muted)] group-hover:text-[var(--docs-text-heading)] transition-colors" />
          )}
          <span className={`whitespace-nowrap ${copied ? "text-[var(--primary)]" : ""}`}>
            {copied ? "Copied" : "Copy Page"}
          </span>
        </button>
        
        <div className="w-[1px] h-[18px] bg-[var(--docs-border-strong)]" />
        
        <button
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center justify-center px-2 h-full text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)] rounded-r-md transition-colors"
          aria-label="More options"
        >
          <ChevronDown size={14} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div
        className={`absolute right-0 top-full mt-2 w-44 z-50
                   bg-[var(--surface)] rounded-lg overflow-hidden
                   shadow-[var(--shadow-tier-2)] border border-[var(--docs-border-faint)]
                   transition-all duration-200 ease-out origin-top-right
                   ${open 
                     ? 'opacity-100 scale-100 translate-y-0 visible' 
                     : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                   }`}
      >
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-2.5 px-3 py-2.5
                     text-xs text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)]
                     hover:bg-[var(--docs-elem-hover)] transition-colors text-left"
        >
          <Copy size={11} />
          Copy as Markdown
        </button>

        <button
          onClick={handleOpenInClaude}
          className="w-full flex items-center gap-2.5 px-3 py-2.5
                     text-xs text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)]
                     hover:bg-[var(--docs-elem-hover)] transition-colors text-left"
        >
          <SiClaude className="orange-400" size={11} />
          Open in Claude
        </button>
      </div>
    </div>
  )
}
