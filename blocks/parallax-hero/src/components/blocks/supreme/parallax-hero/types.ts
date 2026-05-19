export interface ParallaxImageLayer {
  id: string
  src: string
  alt?: string
  width: number
  height: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  depth: number             // 0.1 (jauh) → 1.0 (dekat)
  rotation?: number
  borderRadius?: string
  delay?: number
}

export interface GwenTextBgProps {
  text?: string             // default: 'GWEN'
  duration?: number         // gradient sweep duration detik (default: 3)
  className?: string
}

export interface ParallaxHeroProps {
  headline?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  layers?: ParallaxImageLayer[]
  bgText?: string           // text untuk GwenTextBg (default: 'GWEN')
  className?: string
}
