/**
 * GwenUI Docs — Block Registry
 * Author: JinXSuper
 * License: MIT
 */

import { ComponentType } from "react"

interface BlockEntry {
  Component: ComponentType
  name: string
  category: string
}

type BlockRegistry = Record<string, BlockEntry>

export const blockRegistry: BlockRegistry = {
  "ai-chat-hero": {
    name: "AI Chat Hero",
    category: "hero",
    Component: require("gwenui-blocks/ai-chat-hero").default,
  },
  "auth-login": {
    name: "Auth Login",
    category: "auth",
    Component: require("gwenui-blocks/auth-login").default,
  },
  "parallax-hero": {
    name: "Parallax Hero",
    category: "supreme",
    Component: require("gwenui-blocks/parallax-hero").default,
  },
  "testimonial-marquee": {
    name: "Testimonial Marquee",
    category: "testimonial",
    Component: require("gwenui-blocks/testimonial-marquee").default,
  },
  "dynamic-pricing": {
    name: "Dynamic Pricing",
    category: "pricing",
    Component: require("gwenui-blocks/dynamic-pricing").default,
  },
  "meet-the-team": {
    name: "Meet the Team",
    category: "team",
    Component: require("gwenui-blocks/meet-the-team").default,
  },
  "before-after-slider": {
    name: "Before-After Slider",
    category: "feature",
    Component: require("gwenui-blocks/before-after-slider").default,
  },
  "bento-grid": {
    name: "Bento Grid",
    category: "layout",
    Component: require("gwenui-blocks/bento-grid").BentoGrid,
  },
  "comparison-table": {
    name: "Comparison Table",
    category: "pricing",
    Component: require("gwenui-blocks/comparison-table").ComparisonTable,
  },
  "feature-walkthrough": {
    name: "Feature Walkthrough",
    category: "marketing",
    Component: require("gwenui-blocks/feature-walkthrough").FeatureWalkthrough,
  },
}
