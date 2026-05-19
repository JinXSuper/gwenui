'use client'

import {
  ParallaxHero,
  defaultLayers,
} from '@/src/components/blocks/supreme/parallax-hero'

export default function PreviewParallaxHeroPage() {
  return (
    <ParallaxHero
      headline="Build something extraordinary."
      description="GwenUI Supreme — where design meets dimension."
      primaryCta="Explore Blocks"
      secondaryCta="View Source"
      bgText="GWEN"
      layers={defaultLayers}
      onPrimaryClick={() => {
        window.location.href = 'https://gwenui.vercel.app'
      }}
      onSecondaryClick={() => console.log('secondary')}
    />
  )
}
