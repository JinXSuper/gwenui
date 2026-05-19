import { create } from 'zustand'

export type Phase = 'idle' | 'mask-in' | 'mask-out'

export interface TransitionStore {
  phase: Phase
  isTransitioning: boolean
  trigger: () => Promise<void>
  reveal: () => void
}

export const useTransitionStore = create<TransitionStore>((set) => ({
  phase: 'idle',
  isTransitioning: false,

  trigger: () => new Promise((resolve) => {
    set({ phase: 'mask-in', isTransitioning: true })
    setTimeout(resolve, 400)
  }),

  reveal: () => {
    set({ phase: 'mask-out' })
    setTimeout(() => set({ phase: 'idle', isTransitioning: false }), 450)
  },
}))
