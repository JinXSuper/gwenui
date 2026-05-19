'use client'

import { useRouter } from 'next/navigation'
import { useTransitionStore } from '../store/transitionStore'

export function usePageTransition() {
  const router = useRouter()
  const { trigger, isTransitioning } = useTransitionStore()

  const navigateTo = async (href: string) => {
    if (isTransitioning) return   // Prevent spam click / double transitions
    await trigger()               // Triggers mask-in, resolves once mask is fully covers the screen
    router.push(href)             // Route to the new page
  }

  return { navigateTo, isTransitioning }
}
