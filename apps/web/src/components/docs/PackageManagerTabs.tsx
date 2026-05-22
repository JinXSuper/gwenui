'use client'

import { useState, useEffect, useId } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─────────────────────────────────────────────── */

const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const
type Manager = typeof MANAGERS[number]

export interface PackageManagerTabsProps {
  /** The base command WITHOUT the package manager prefix.
   *  e.g. "dlx @gwenui/cli add bento-grid"
   *  or   "install framer-motion"
   */
  command: string
  /** Optional label shown next to the terminal icon */
  label?: string
}

/* ─── Command generator ──────────────────────────────────── */

function getCommand(manager: Manager, command: string): string {
  // Detect if it's an "exec/dlx" command (no persistent install)
  const isDlx = command.startsWith('dlx ') || command.startsWith('create ')

  if (isDlx) {
    const cmd = command.replace(/^dlx /, '')
    switch (manager) {
      case 'pnpm': return `pnpm dlx ${cmd}`
      case 'npm': return `npx ${cmd}`
      case 'yarn': return `yarn dlx ${cmd}`
      case 'bun': return `bunx ${cmd}`
    }
  }

  // Regular install
  switch (manager) {
    case 'pnpm': return `pnpm ${command}`
    case 'npm': return `npm ${command}`
    case 'yarn': return `yarn ${command.replace(/^install/, 'add')}`
    case 'bun': return `bun ${command}`
  }
}

/* ─── Component ──────────────────────────────────────────── */

export function PackageManagerTabs({ command, label }: PackageManagerTabsProps) {
  const uid = useId()

  // Hydration-safe localStorage read
  const [active, setActive] = useState<Manager>('pnpm')
  useEffect(() => {
    const stored = localStorage.getItem('gwen-pkg-manager') as Manager | null
    if (stored && (MANAGERS as readonly string[]).includes(stored)) {
      setActive(stored)
    }
  }, [])

  const [copied, setCopied] = useState(false)

  const currentCommand = getCommand(active, command)

  const handleSelect = (m: Manager) => {
    setActive(m)
    localStorage.setItem('gwen-pkg-manager', m)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="my-6 rounded-xl overflow-hidden"
      style={{
        background: 'var(--background)',
        border: '1px solid var(--docs-border-faint)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--docs-border-faint)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Terminal icon */}
          <div
            className="flex items-center justify-center w-6 h-6 rounded"
            style={{
              background: 'var(--docs-elem-surface)',
              color: 'var(--docs-text-faint)',
            }}
          >
            <Terminal size={14} />
          </div>

          {/* Optional label */}
          {label && (
            <span
              className="text-[11px] font-mono"
              style={{ color: 'var(--docs-text-faint)' }}
            >
              {label}
            </span>
          )}

          {/* Manager tabs */}
          <div className="flex items-center gap-1">
            {MANAGERS.map((m) => {
              const isActive = active === m
              return (
                <button
                  key={m}
                  onClick={() => handleSelect(m)}
                  className="relative px-3 py-0.5 text-[13px] font-mono rounded-full cursor-pointer transition-colors duration-150"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: isActive
                      ? 'var(--docs-text-heading)'
                      : 'var(--docs-text-dim)',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId={`pkg-tab-${uid}`}
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'var(--docs-elem-surface-strong)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{m}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--docs-text-dim)' }}
          title="Copy command"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'block', color: 'var(--primary)' }}
              >
                <Check size={14} />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'block' }}
              >
                <Copy size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Command content ── */}
      <div className="relative overflow-hidden px-5 py-3.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.pre
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="m-0 text-sm font-mono leading-relaxed"
            style={{ color: 'var(--docs-text-heading)', background: 'transparent' }}
          >
            <span style={{ color: 'var(--primary)', userSelect: 'none' }}>$ </span>
            {currentCommand}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PackageManagerTabs