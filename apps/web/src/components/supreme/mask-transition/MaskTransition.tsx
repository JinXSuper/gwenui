'use client'

import { useEffect, useRef } from 'react'
import { useTransitionStore } from './store/transitionStore'

export function MaskTransition() {
  const { phase } = useTransitionStore()
  const circleRef = useRef<SVGCircleElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!circleRef.current) return

    // Calculate maximum radius = diagonal of screen / 2 + padding (to cover borders completely)
    const maxR = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 20

    if (phase === 'mask-in') {
      // Ensure the SVG is fully opaque at the start of exit transition
      if (svgRef.current) {
        svgRef.current.style.opacity = '1'
      }

      // Circle expands to cover the whole screen
      circleRef.current.animate(
        [
          { r: '0px' },
          { r: `${maxR}px` }
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
          fill: 'forwards'
        }
      )
    } else if (phase === 'mask-out') {
      // Circle continues to expand outward creating a zoom effect
      circleRef.current.animate(
        [
          { r: `${maxR}px` },
          { r: `${maxR * 1.4}px` }
        ],
        {
          duration: 400,
          easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
          fill: 'forwards'
        }
      )

      // Simultaneously, the entire SVG overlay fades out smoothly
      if (svgRef.current) {
        svgRef.current.animate(
          [
            { opacity: '1' },
            { opacity: '0' }
          ],
          {
            duration: 400,
            easing: 'ease-out',
            fill: 'forwards'
          }
        )
      }
    }
  }, [phase])

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 1,
      }}
    >
      <defs>
        <clipPath id="gwen-mask-clip">
          <circle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r="0"
          />
        </clipPath>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="var(--background, #080810)"
        clipPath="url(#gwen-mask-clip)"
      />
    </svg>
  )
}
