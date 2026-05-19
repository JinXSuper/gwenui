'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyCodeButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const pre = e.currentTarget.nextElementSibling as HTMLPreElement
    if (!pre) return

    const text = pre.innerText
    await navigator.clipboard.writeText(text)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md
                 bg-[var(--surface-raised)] border border-[var(--border)]
                 text-[var(--text-muted)] hover:text-[var(--text)]
                 opacity-0 group-hover:opacity-100 transition-opacity"
      title="Copy code"
    >
      {copied ? <Check size={14} className="text-[var(--primary)]" /> : <Copy size={14} />}
    </button>
  )
}
