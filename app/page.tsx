'use client'

import {
  ParallaxHero,
  defaultLayers,
} from '@/src/components/blocks/supreme/parallax-hero'

export default function Home() {
  return (
    <main>
      <ParallaxHero
        headline="Build With GwenUI"
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
    </main>
  )
}
