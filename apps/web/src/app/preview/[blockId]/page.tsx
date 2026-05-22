import { notFound } from "next/navigation"
import { BentoGrid } from "gwenui-blocks/bento-grid"
import TestimonialMarquee from "gwenui-blocks/testimonial-marquee"
import DynamicPricing from "gwenui-blocks/dynamic-pricing"
import MeetTheTeam from "gwenui-blocks/meet-the-team"
import BeforeAfterSlider from "gwenui-blocks/before-after-slider"
import AIChatHero from "gwenui-blocks/ai-chat-hero"
import AuthLogin from "gwenui-blocks/auth-login"
import ParallaxHero from "gwenui-blocks/parallax-hero"
import { ComparisonTable } from "gwenui-blocks/comparison-table"
import { FeatureWalkthrough } from "gwenui-blocks/feature-walkthrough"
import { cn } from "@/lib/utils"

const BLOCK_MAP: Record<string, React.FC<any>> = {
  "bento-grid": BentoGrid,
  "testimonial-marquee": TestimonialMarquee,
  "dynamic-pricing": DynamicPricing,
  "meet-the-team": MeetTheTeam,
  "before-after-slider": BeforeAfterSlider,
  "ai-chat-hero": AIChatHero,
  "ai-chat": AIChatHero,
  "auth-login": AuthLogin,
  "login": AuthLogin,
  "parallax-hero": ParallaxHero,
  "comparison-table": ComparisonTable,
  "feature-walkthrough": FeatureWalkthrough,
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ blockId: string }> | { blockId: string }
  searchParams: Promise<{ theme?: string; variant?: string }> | { theme?: string; variant?: string }
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const blockId = resolvedParams.blockId
  const theme = resolvedSearchParams.theme || "dark"
  const variant = resolvedSearchParams.variant

  const Component = BLOCK_MAP[blockId]

  if (!Component) {
    notFound()
  }

  return (
    <div
      className={cn(
        "w-full min-h-screen",
        theme === "dark" ? "dark" : ""
      )}
      style={{ background: "oklch(0.1895 0.0496 296)" }}
    >
      <Component variant={variant} />
    </div>
  )
}
