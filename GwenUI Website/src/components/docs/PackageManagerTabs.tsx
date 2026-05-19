'use client'
import { useState, useRef, useId } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'

const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const
type Manager = typeof MANAGERS[number]

export function PackageManagerTabs({ children }: { children: React.ReactNode }) {
  const uid = useId()
  const [active, setActive] = useState<Manager>(() => {
    if (typeof window === 'undefined') return 'pnpm'
    return (localStorage.getItem('gwen-pkg-manager') as Manager) ?? 'pnpm'
  })
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    if (!containerRef.current) return
    const activeTab = containerRef.current.querySelector(`[data-tab-value="${active}"]`)
    if (activeTab) {
      const text = (activeTab as HTMLElement).innerText.trim()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const activeTabChild = React.Children.toArray(children).find(
    child => React.isValidElement(child) && (child as React.ReactElement<any>).props.value === active
  )

  return (
    <div className="my-6 rounded-xl bg-[var(--preview-bg)] border border-[var(--docs-border-faint)] overflow-hidden shadow-[var(--shadow-tier-1)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--docs-border-faint)] bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-[var(--docs-elem-surface)] text-[var(--docs-text-faint)]">
            <Terminal size={14} />
          </div>
          <div className="flex items-center gap-1">
            {MANAGERS.map(m => {
              const activeTab = active === m
              return (
                <button
                  key={m}
                  onClick={() => {
                    setActive(m)
                    localStorage.setItem('gwen-pkg-manager', m)
                  }}
                  className={`px-3 py-0.5 text-[13px] font-mono rounded-full cursor-pointer transition-colors duration-200 border-none outline-none relative ${
                    activeTab
                      ? 'text-[var(--docs-text-heading)]'
                      : 'text-[var(--docs-text-dim)] hover:text-[var(--docs-text-muted)]'
                  }`}
                  style={{
                    outline: 'none',
                    background: 'transparent',
                  }}
                >
                  {activeTab && (
                    <motion.div
                      layoutId={`active-pkg-tab-${uid}`}
                      className="absolute inset-0 bg-[var(--docs-elem-surface-strong)] rounded-full gwen-premium-interactive"
                      style={{ transition: 'none' }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{m}</span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-[var(--docs-text-dim)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)] transition-colors"
          title="Copy command"
        >
          {copied ? <Check size={14} className="text-[var(--primary)]" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Content */}
      <div ref={containerRef} className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 3, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.995 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-none [&_pre]:!bg-transparent [&_pre::before]:!hidden [&_.absolute]:!hidden"
          >
            {activeTabChild}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  return <div data-tab-value={value}>{children}</div>
}
