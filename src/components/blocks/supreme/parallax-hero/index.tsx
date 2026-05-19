export { ParallaxHero } from './ParallaxHero'
export type { ParallaxHeroProps, ParallaxImageLayer } from './types'

import type { ParallaxImageLayer } from './types'

export const defaultLayers: ParallaxImageLayer[] = [
  {
    id: 'l1',
    src: '/image/gwen1.webp',
    width: 320,
    height: 240,
    top: '8%',
    left: '8%',
    depth: 0.4,
    rotation: -6,
    delay: 0,
  },
  {
    id: 'l2',
    src: '/image/gwen2.webp',
    width: 280,
    height: 340,
    top: '40%',
    left: '4%',
    depth: 0.7,
    rotation: -3,
    delay: 0.1,
  },
  {
    id: 'l3',
    src: '/image/gwen3.webp',
    width: 300,
    height: 220,
    top: '6%',
    right: '6%',
    depth: 0.5,
    rotation: 5,
    delay: 0.15,
  },
  {
    id: 'l4',
    src: '/image/gwen4.webp',
    width: 260,
    height: 320,
    top: '38%',
    right: '3%',
    depth: 0.8,
    rotation: 4,
    delay: 0.05,
  },
  {
    id: 'l5',
    src: '/image/gwen5.webp',
    width: 240,
    height: 280,
    bottom: '2%',
    left: '50%',
    depth: 0.6,
    rotation: -2,
    delay: 0.2,
  },
]

export const blockMeta = {
  id: 'parallax-hero',
  name: 'Parallax Hero',
  category: 'supreme',
  description:
    'Hero section dengan floating parallax images + SVG text hover gradient background "GWEN". Lora headline, Jakarta Sans desc, dual CTA shadcn.',
  iframeHeight: '100vh',
  tags: ['hero', 'parallax', 'mouse', 'framer-motion', 'svg', 'text-effect'],
}
