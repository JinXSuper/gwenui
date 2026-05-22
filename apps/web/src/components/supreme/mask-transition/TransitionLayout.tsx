'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTransitionStore } from './store/transitionStore'
import { usePageTransition } from './hooks/usePageTransition'
import { MaskTransition } from './MaskTransition'

export function TransitionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { reveal, isTransitioning } = useTransitionStore()
  const { navigateTo } = usePageTransition()

  const isFirstMount = useRef(true)

  // 1. Pathname change listener to handle automatic mask-out reveal on page arrival
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    const { phase } = useTransitionStore.getState()
    if (phase !== 'mask-in') return

    const timeout = setTimeout(() => reveal(), 50)
    return () => clearTimeout(timeout)
  }, [pathname, reveal])

  // 2. Global Capturing-Phase Click Interceptor to run transition on standard link clicks
  useEffect(() => {
    const handleGlobalClick = async (e: MouseEvent) => {
      // Find the closest parent anchor tag
      let target = e.target as HTMLElement | null
      while (target && target.tagName !== 'A') {
        target = target.parentElement
      }
      
      if (!target || !(target instanceof HTMLAnchorElement)) return
      
      const href = target.getAttribute('href')
      if (!href) return
      
      // Skip if explicitly opted out or is non-standard navigation
      if (
        target.hasAttribute('data-no-transition') ||
        target.getAttribute('data-transition') === 'false' ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.includes('://') ||
        target.target === '_blank' ||
        target.hasAttribute('download')
      ) {
        return
      }
      
      // Skip if keyboard modifiers are used (Ctrl, Shift, Command, Alt)
      if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return
      
      // Intercept navigation: Cancel event so Next.js click handler doesn't fire
      e.preventDefault()
      e.stopPropagation()
      
      // Trigger SVG mask transition expand, then perform router push
      await navigateTo(href)
    }
    
    // Add in capturing phase to intercept click before Next.js Link handlers trigger
    window.addEventListener('click', handleGlobalClick, { capture: true })
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true })
    }
  }, [navigateTo])

  return (
    <>
      {isTransitioning && <MaskTransition />}
      {children}
    </>
  )
}
