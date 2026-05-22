'use client'
import { usePageTransition } from '@/components/supreme/mask-transition'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationItem {
  title: string
  href: string
}

interface DocsPaginationProps {
  prev?: PaginationItem
  next?: PaginationItem
}

export function DocsPagination({ prev, next }: DocsPaginationProps) {
  const { navigateTo } = usePageTransition()

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => prev && navigateTo(prev.href)}
        disabled={!prev}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--surface)] border border-[var(--docs-border-faint)] text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)] transition-colors disabled:opacity-30 disabled:hover:bg-[var(--surface)] disabled:hover:text-[var(--docs-text-muted)] disabled:shadow-none"
        title={prev ? `Previous: ${prev.title}` : undefined}
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={() => next && navigateTo(next.href)}
        disabled={!next}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--surface)] border border-[var(--docs-border-faint)] text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)] transition-colors disabled:opacity-30 disabled:hover:bg-[var(--surface)] disabled:hover:text-[var(--docs-text-muted)] disabled:shadow-none"
        title={next ? `Next: ${next.title}` : undefined}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
