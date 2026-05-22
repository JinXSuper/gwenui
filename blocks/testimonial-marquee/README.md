# Testimonial Marquee

Infinite auto-scroll testimonial marquee with Twitter/X style cards.

## Usage

```bash
gwenui add testimonial-marquee
```

```tsx
import TestimonialMarquee from "@/components/blocks/testimonial-marquee"

export default function Page() {
  return <TestimonialMarquee rows={2} pauseOnHover />
}
```

## Props

| Prop | Type | Default |
|------|------|---------|
| testimonials | Testimonial[] | 8 defaults |
| speed | number | 30 |
| rows | 1 \| 2 | 2 |
| pauseOnHover | boolean | true |
| onHoverPause | boolean \| "yes" \| "no" | true |
| animated | boolean \| "yes" \| "no" | true |
| className | string | — |

## Testimonial Type

```ts
interface Testimonial {
  id: string
  name: string
  handle: string
  avatar: string
  quote: string
  date: string
  verified?: boolean
}
```

## Features

- Infinite seamless auto-scroll marquee
- Twitter/X style testimonial cards with verified badges
- Two-row layout with opposite scroll directions
- Gradient fade edges for premium feel
- Pause on hover interaction
- Fully responsive — works on all breakpoints
- GwenUI design tokens — automatic dark/light theme support
