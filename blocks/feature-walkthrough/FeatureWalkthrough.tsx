/**
 * Block: Feature Walkthrough
 * Author: JinXSuper
 * License: MIT
 */
"use client"

import React, { useState, useEffect, useId } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  LayoutGrid,
  Rocket,
  Sparkles,
  Box,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── Embedded CSS ───────────────────────────────────────── */

const WALKTHROUGH_STYLES = `
  .walkthrough-root {
    display: grid;
    grid-template-columns: 40% 60%;
    gap: 2rem;
    width: 100%;
    max-width: 72rem;
    margin: 0 auto;
    padding: 3rem 1rem;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    color: oklch(0.92 0.01 265);
    background: oklch(0.1895 0.0496 296);
  }
  .walkthrough-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .walkthrough-preview {
    position: sticky;
    top: 2rem;
    height: fit-content;
  }
  .walkthrough-step {
    position: relative;
    min-height: 240px;
    padding: 2rem 1.5rem;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: border-color 200ms ease, background 200ms ease;
    outline: none;
    border-top: none;
    border-right: none;
    border-bottom: none;
    background: transparent;
    text-align: left;
    width: 100%;
  }
  .walkthrough-step[data-active="true"] {
    border-left: 2px solid oklch(0.72 0.15 48);
    background: oklch(0.13 0.005 265);
  }
  .walkthrough-step[data-active="false"] .walkthrough-step-title {
    color: oklch(0.5 0.02 265);
  }
  .walkthrough-step-number {
    font-family: "Space Mono", ui-monospace, monospace;
    font-size: 0.875rem;
    color: oklch(0.7204 0.1507 48);
    margin-bottom: 0.5rem;
    display: block;
  }
  .walkthrough-step-title {
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.3;
    color: oklch(0.95 0.01 265);
    margin: 0 0 0.5rem 0;
    transition: color 200ms ease;
  }
  .walkthrough-step-desc {
    font-size: 0.875rem;
    line-height: 1.55;
    color: oklch(0.65 0.02 285);
    margin: 0;
  }
  .walkthrough-step-badge {
    display: inline-block;
    margin-bottom: 0.5rem;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: oklch(0.72 0.15 48 / 18%);
    color: oklch(0.72 0.15 48);
    font-family: "Space Mono", ui-monospace, monospace;
  }
  .walkthrough-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: oklch(0.72 0.15 48);
    border-radius: 0 2px 2px 0;
  }
  .walkthrough-glass {
    background: oklch(0.13 0.005 265);
    border: 1px solid oklch(0.68 0.18 48 / 20%);
    border-radius: 1.25rem;
    padding: 2rem;
    min-height: 320px;
    display: flex;
    flex-direction: column;
  }
  .walkthrough-glass-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid oklch(0.25 0.02 265 / 50%);
  }
  .walkthrough-dots {
    display: flex;
    gap: 0.4rem;
  }
  .walkthrough-dot {
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 50%;
  }
  .walkthrough-dot-red { background: oklch(0.62 0.2 25); }
  .walkthrough-dot-yellow { background: oklch(0.78 0.16 85); }
  .walkthrough-dot-green { background: oklch(0.65 0.18 145); }
  .walkthrough-preview-pill {
    font-family: "Space Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.25rem 0.65rem;
    border-radius: 9999px;
    background: oklch(0.72 0.15 48 / 15%);
    color: oklch(0.72 0.15 48);
    border: 1px solid oklch(0.72 0.15 48 / 25%);
  }
  .walkthrough-visual {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
  .walkthrough-mock-terminal {
    width: 100%;
    font-family: "Space Mono", ui-monospace, monospace;
    font-size: 0.75rem;
    line-height: 1.7;
    color: oklch(0.75 0.02 265);
  }
  .walkthrough-mock-prompt {
    color: oklch(0.7204 0.1507 48);
  }
  .walkthrough-mock-success {
    color: oklch(0.65 0.18 145);
  }
  .walkthrough-mock-dim {
    color: oklch(0.45 0.02 265);
  }
  .walkthrough-block-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    width: 100%;
  }
  .walkthrough-block-card {
    padding: 1rem;
    border-radius: 0.75rem;
    background: oklch(0.16 0.02 296);
    border: 1px solid oklch(0.28 0.02 265 / 60%);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  .walkthrough-block-card-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: oklch(0.72 0.15 48 / 15%);
    color: oklch(0.72 0.15 48);
  }
  .walkthrough-block-card-title {
    font-size: 0.6875rem;
    font-weight: 600;
    color: oklch(0.85 0.01 265);
  }
  .walkthrough-code {
    width: 100%;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    background: oklch(0.1 0.01 265);
    border: 1px solid oklch(0.25 0.02 265 / 50%);
    font-family: "Space Mono", ui-monospace, monospace;
    font-size: 0.75rem;
    line-height: 1.8;
    color: oklch(0.7 0.02 265);
  }
  .walkthrough-code-var {
    color: oklch(0.55 0.12 290);
  }
  .walkthrough-code-value {
    color: oklch(0.72 0.15 48);
  }
  .walkthrough-deploy {
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 1rem;
    background: oklch(0.16 0.02 296);
    border: 1px solid oklch(0.65 0.18 145 / 30%);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .walkthrough-deploy-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: oklch(0.65 0.18 145 / 20%);
    color: oklch(0.65 0.18 145);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .walkthrough-deploy-title {
    font-weight: 700;
    font-size: 1rem;
    color: oklch(0.95 0.01 265);
  }
  .walkthrough-deploy-sub {
    font-size: 0.75rem;
    color: oklch(0.55 0.02 265);
  }
  @media (max-width: 768px) {
    .walkthrough-root {
      grid-template-columns: 1fr;
    }
    .walkthrough-preview {
      position: static;
    }
    .walkthrough-step {
      min-height: auto;
      padding: 1.5rem 1.25rem;
    }
  }
`

/* ─── Types ─────────────────────────────────────────────── */

export interface WalkthroughStep {
  id: string
  stepNumber: string
  title: string
  description: string
  visual: React.ReactNode
  badge?: string
}

export interface FeatureWalkthroughProps {
  steps?: WalkthroughStep[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

/* ─── Demo visuals ──────────────────────────────────────── */

const InstallVisual: React.FC = () => (
  <div className="walkthrough-mock-terminal">
    <div>
      <span className="walkthrough-mock-prompt">$ </span>
      npx gwenui init
    </div>
    <div className="walkthrough-mock-dim" style={{ marginTop: "0.75rem" }}>
      ✓ Scaffolding GwenUI in your project...
    </div>
    <div className="walkthrough-mock-dim">✓ Installing @gwenui/themes</div>
    <div className="walkthrough-mock-dim">✓ Writing globals.css tokens</div>
    <div className="walkthrough-mock-success" style={{ marginTop: "0.5rem" }}>
      Done! Gwen Noir is ready.
    </div>
  </div>
)

const BrowseVisual: React.FC = () => (
  <div className="walkthrough-block-grid">
    {[
      { icon: LayoutGrid, title: "Bento Grid" },
      { icon: Sparkles, title: "AI Chat Hero" },
      { icon: Box, title: "Parallax Hero" },
    ].map(({ icon: Icon, title }) => (
      <div key={title} className="walkthrough-block-card">
        <div className="walkthrough-block-card-icon">
          <Icon size={16} />
        </div>
        <span className="walkthrough-block-card-title">{title}</span>
      </div>
    ))}
  </div>
)

const AddVisual: React.FC = () => (
  <div className="walkthrough-mock-terminal">
    <div>
      <span className="walkthrough-mock-prompt">$ </span>
      gwenui add bento-grid
    </div>
    <div className="walkthrough-mock-dim" style={{ marginTop: "0.75rem" }}>
      Fetching block from registry...
    </div>
    <div className="walkthrough-mock-success" style={{ marginTop: "0.5rem" }}>
      ✓ Copied to /components/blocks/bento-grid
    </div>
    <div className="walkthrough-mock-dim">✓ Installed framer-motion, lucide-react</div>
  </div>
)

const CustomizeVisual: React.FC = () => (
  <pre className="walkthrough-code">
    <span className="walkthrough-code-var">:root {"{"}</span>
    {"\n  "}
    <span className="walkthrough-code-var">--primary:</span>{" "}
    <span className="walkthrough-code-value">oklch(0.72 0.15 48);</span>
    {"\n  "}
    <span className="walkthrough-code-var">--background:</span>{" "}
    <span className="walkthrough-code-value">oklch(0.19 0.05 296);</span>
    {"\n  "}
    <span className="walkthrough-code-var">--radius:</span>{" "}
    <span className="walkthrough-code-value">0.75rem;</span>
    {"\n"}
    <span className="walkthrough-code-var">{"}"}</span>
  </pre>
)

const ShipVisual: React.FC = () => (
  <div className="walkthrough-deploy">
    <div className="walkthrough-deploy-icon">
      <Check size={28} strokeWidth={2.5} />
    </div>
    <div className="walkthrough-deploy-title">Deployed successfully</div>
    <div className="walkthrough-deploy-sub">gwen-ui.vercel.app · Production</div>
    <Rocket size={18} style={{ color: "oklch(0.72 0.15 48)", marginTop: "0.25rem" }} />
  </div>
)

const DEMO_STEPS: WalkthroughStep[] = [
  {
    id: "install",
    stepNumber: "01",
    title: "Install",
    description: "Run gwenui init to scaffold tokens, fonts, and config in seconds.",
    badge: "CLI",
    visual: <InstallVisual />,
  },
  {
    id: "browse",
    stepNumber: "02",
    title: "Browse Blocks",
    description:
      "Explore 40+ production-ready blocks across Basic, Supreme, and AI categories.",
    visual: <BrowseVisual />,
  },
  {
    id: "add",
    stepNumber: "03",
    title: "Add to Project",
    description:
      "Pick a block and run gwenui add. The component is copied directly into your codebase.",
    badge: "Yours",
    visual: <AddVisual />,
  },
  {
    id: "customize",
    stepNumber: "04",
    title: "Customize",
    description:
      "Tweak OKLCH tokens in globals.css. Every color, radius, and shadow is a CSS variable.",
    visual: <CustomizeVisual />,
  },
  {
    id: "ship",
    stepNumber: "05",
    title: "Ship",
    description:
      "Deploy to Vercel, Netlify, or anywhere. Zero lock-in — you own every line.",
    visual: <ShipVisual />,
  },
]

/* ─── FeatureWalkthrough ────────────────────────────────── */

export const FeatureWalkthrough: React.FC<FeatureWalkthroughProps> = ({
  steps = DEMO_STEPS,
  autoPlay = false,
  autoPlayInterval = 4000,
  className,
}) => {
  const uid = useId()
  const [activeId, setActiveId] = useState(steps[0]?.id ?? "")
  const [paused, setPaused] = useState(false)

  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === activeId)
  )
  const activeStep = steps[activeIndex] ?? steps[0]

  useEffect(() => {
    if (!autoPlay || paused || steps.length < 2) return

    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const idx = steps.findIndex((s) => s.id === current)
        const next = idx < 0 ? 0 : (idx + 1) % steps.length
        return steps[next].id
      })
    }, autoPlayInterval)

    return () => window.clearInterval(timer)
  }, [autoPlay, autoPlayInterval, paused, steps])

  useEffect(() => {
    if (steps.length && !steps.some((s) => s.id === activeId)) {
      setActiveId(steps[0].id)
    }
  }, [steps, activeId])

  return (
    <section
      className={cn("walkthrough-root", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: WALKTHROUGH_STYLES }} />

      <div className="walkthrough-steps" role="tablist" aria-label="Feature walkthrough steps">
        {steps.map((step, index) => {
          const isActive = step.id === activeId
          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`walkthrough-panel-${uid}-${step.id}`}
              id={`walkthrough-tab-${uid}-${step.id}`}
              data-active={isActive ? "true" : "false"}
              className="walkthrough-step"
              onClick={() => setActiveId(step.id)}
              onFocus={() => setActiveId(step.id)}
            >
              {isActive && (
                <motion.div
                  layoutId={`walkthrough-indicator-${uid}`}
                  className="walkthrough-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {step.badge && (
                <span className="walkthrough-step-badge">{step.badge}</span>
              )}
              <span className="walkthrough-step-number">{step.stepNumber}</span>
              <h3 className="walkthrough-step-title">{step.title}</h3>
              <p className="walkthrough-step-desc">{step.description}</p>
            </button>
          )
        })}
      </div>

      <div className="walkthrough-preview">
        <div
          className="walkthrough-glass"
          role="tabpanel"
          id={`walkthrough-panel-${uid}-${activeStep.id}`}
          aria-labelledby={`walkthrough-tab-${uid}-${activeStep.id}`}
        >
          <div className="walkthrough-glass-bar">
            <div className="walkthrough-dots" aria-hidden>
              <span className="walkthrough-dot walkthrough-dot-red" />
              <span className="walkthrough-dot walkthrough-dot-yellow" />
              <span className="walkthrough-dot walkthrough-dot-green" />
            </div>
            <span className="walkthrough-preview-pill">
              {activeStep.stepNumber} · {activeStep.title}
            </span>
          </div>
          <div className="walkthrough-visual">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ width: "100%" }}
              >
                {activeStep.visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureWalkthrough
