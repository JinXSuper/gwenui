/**
 * Block: Comparison Table
 * Author: JinXSuper
 * License: MIT
 */
"use client"

import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Info } from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── Embedded table CSS ─────────────────────────────────── */

const TABLE_STYLES = `
  .comparison-wrapper {
    width: 100%;
    max-width: 72rem;
    margin: 0 auto;
    padding: 3rem 1rem;
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    color: oklch(0.92 0.01 265);
    background: oklch(0.1895 0.0496 296);
  }
  .comparison-scroll {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: oklch(0.35 0.02 265) transparent;
  }
  .comparison-table {
    width: 100%;
    min-width: 840px;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
  }
  .comparison-table th,
  .comparison-table td {
    padding: 1rem 1.25rem;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid oklch(0.25 0.02 265 / 40%);
  }
  .comparison-table .col-label {
    width: 200px;
    min-width: 200px;
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 10;
    background: oklch(0.1895 0.0496 296);
    box-shadow: 4px 0 12px oklch(0 0 0 / 12%);
  }
  .comparison-table .col-plan {
    min-width: 160px;
    width: 18%;
  }
  .comparison-table thead {
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .comparison-table thead th {
    background: oklch(0.1895 0.0496 296);
    border-bottom: 1px solid oklch(0.28 0.02 265 / 50%);
    vertical-align: bottom;
    padding-top: 1.5rem;
    padding-bottom: 1.25rem;
  }
  .comparison-table thead .col-label {
    z-index: 21;
    vertical-align: bottom;
  }
  .col-highlighted {
    background: oklch(0.68 0.18 48 / 6%);
  }
  .col-highlighted-header {
    border-top: 2px solid oklch(0.72 0.15 48);
    box-shadow:
      0 -1px 0 oklch(0.72 0.15 48 / 20%),
      0 8px 24px oklch(0.72 0.15 48 / 8%);
  }
  .comparison-table tbody tr.row-alt td {
    background: oklch(0.13 0.005 265 / 50%);
  }
  .comparison-table tbody tr.row-alt .col-label {
    background: oklch(0.16 0.02 296);
  }
  .comparison-table tbody tr.row-alt .col-highlighted {
    background: oklch(0.68 0.18 48 / 8%);
  }
  .comparison-table tbody tr:hover td {
    background: oklch(0.68 0.18 48 / 4%);
  }
  .comparison-table tbody tr:hover .col-label {
    background: oklch(0.2 0.03 296);
  }
  .comparison-table tbody tr:hover .col-highlighted {
    background: oklch(0.68 0.18 48 / 10%);
  }
  .comparison-table .category-row td {
    background: oklch(0.13 0.005 265) !important;
    border-bottom: none;
    padding: 0.65rem 1.25rem;
    font-family: "Space Mono", ui-monospace, monospace;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: oklch(0.55 0.02 265);
    text-align: left;
  }
  .comparison-table .category-row .col-label {
    background: oklch(0.13 0.005 265) !important;
    box-shadow: none;
  }
  .comparison-plan-name {
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.3;
    color: oklch(0.95 0.01 265);
    margin-bottom: 0.5rem;
  }
  .comparison-price-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    min-height: 3.5rem;
  }
  .comparison-price {
    font-family: "Space Mono", ui-monospace, monospace;
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .comparison-price-paid {
    color: oklch(0.7204 0.1507 48);
  }
  .comparison-price-free {
    color: oklch(0.75 0.02 265);
  }
  .comparison-price-suffix {
    font-size: 0.75rem;
    color: oklch(0.5 0.02 265);
    font-family: "Plus Jakarta Sans", system-ui, sans-serif;
    font-weight: 500;
  }
  .comparison-discount-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.45rem;
    border-radius: 9999px;
    font-size: 0.625rem;
    font-weight: 700;
    font-family: "Space Mono", ui-monospace, monospace;
    background: oklch(0.72 0.15 48 / 18%);
    color: oklch(0.72 0.15 48);
    margin-left: 0.35rem;
  }
  .comparison-badge {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.2rem 0.55rem;
    border-radius: 9999px;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: oklch(0.72 0.15 48);
    color: oklch(0.15 0.02 265);
  }
  .comparison-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 9rem;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    border: none;
    outline: none;
  }
  .comparison-cta:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
  .comparison-cta-outline {
    background: transparent;
    border: 1px solid oklch(0.4 0.02 265);
    color: oklch(0.88 0.01 265);
  }
  .comparison-cta-solid {
    background: oklch(0.72 0.15 48);
    color: oklch(0.12 0.02 265);
  }
  .comparison-cta-glow {
    background: oklch(0.72 0.15 48);
    color: oklch(0.12 0.02 265);
    box-shadow: 0 0 20px oklch(0.72 0.15 48 / 30%);
  }
  .comparison-cell-text {
    font-size: 0.8125rem;
    color: oklch(0.55 0.02 265);
    line-height: 1.35;
  }
  .comparison-cell-premium {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
  }
  .comparison-cell-premium-tag {
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: oklch(0.72 0.15 48);
  }
  .comparison-billing-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }
  .comparison-billing-pill {
    display: inline-flex;
    position: relative;
    padding: 0.25rem;
    border-radius: 9999px;
    background: oklch(0.13 0.005 265);
    border: 1px solid oklch(0.28 0.02 265 / 50%);
  }
  .comparison-billing-btn {
    position: relative;
    z-index: 1;
    padding: 0.4rem 1.25rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    background: transparent;
    color: oklch(0.5 0.02 265);
    transition: color 0.15s;
    outline: none;
  }
  .comparison-billing-btn.is-active {
    color: oklch(0.95 0.01 265);
  }
  .comparison-billing-indicator {
    background: oklch(0.25 0.03 296);
    border: 1px solid oklch(0.35 0.02 265 / 40%);
  }
  .comparison-feature-label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .comparison-tooltip-icon {
    color: oklch(0.45 0.01 265);
    flex-shrink: 0;
    cursor: help;
  }
`

/* ─── Types ─────────────────────────────────────────────── */

export type BillingPeriod = "monthly" | "annual"
export type PlanPrice = number | "Custom"

export interface ComparisonPlanPrice {
  monthly: PlanPrice
  annual?: PlanPrice
}

export interface ComparisonPlan {
  id: string
  name: string
  price: ComparisonPlanPrice
  priceSuffix?: string
  highlighted?: boolean
  badge?: string
}

export interface ComparisonFeature {
  category: string
  label: string
  tooltip?: string
  values: Record<string, boolean | string>
}

export interface ComparisonTableProps {
  plans?: ComparisonPlan[]
  features?: ComparisonFeature[]
  billingToggle?: boolean
  ctaLabel?: string
  className?: string
  onCtaClick?: (planId: string) => void
}

type FeatureCellValue = boolean | string
type ComparisonCtaVariant = "outline" | "solid" | "solid-glow"

/* ─── Defaults ──────────────────────────────────────────── */

const DEFAULT_PLANS: ComparisonPlan[] = [
  { id: "free", name: "Free", price: { monthly: 0 } },
  { id: "pro", name: "Pro", price: { monthly: 20, annual: 17 } },
  {
    id: "max",
    name: "Max",
    price: { monthly: 100, annual: 85 },
    badge: "Most Popular",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    price: { monthly: 25, annual: 21.25 },
    priceSuffix: "/seat/mo",
    badge: "Best Value",
  },
]

const DEFAULT_FEATURES: ComparisonFeature[] = [
  { category: "Usage", label: "Messages per day", values: { free: "Limited", pro: "5x Free", max: "25x Free", team: "Pooled" } },
  { category: "Usage", label: "Context window", values: { free: "200K", pro: "200K", max: "200K", team: "200K" } },
  { category: "Usage", label: "Priority access", values: { free: false, pro: true, max: "✓ Max", team: true } },
  { category: "Models", label: "Claude Haiku", values: { free: true, pro: true, max: true, team: true } },
  { category: "Models", label: "Claude Sonnet", values: { free: true, pro: true, max: true, team: true } },
  { category: "Models", label: "Claude Opus", values: { free: false, pro: true, max: true, team: true } },
  { category: "Features", label: "Projects", values: { free: true, pro: true, max: true, team: true } },
  { category: "Features", label: "Memory", values: { free: true, pro: true, max: true, team: true } },
  { category: "Features", label: "Web Search", values: { free: "Limited", pro: true, max: true, team: true } },
  { category: "Features", label: "Claude Code", values: { free: false, pro: true, max: true, team: "premium" } },
  { category: "Features", label: "Artifacts", values: { free: true, pro: true, max: true, team: true } },
  { category: "Collaboration", label: "Shared Projects", values: { free: false, pro: false, max: false, team: true } },
  { category: "Collaboration", label: "Central Billing", values: { free: false, pro: false, max: false, team: true } },
  { category: "Collaboration", label: "Admin Console", values: { free: false, pro: false, max: false, team: true } },
  { category: "Collaboration", label: "Min. seats", values: { free: "—", pro: "—", max: "—", team: "5" } },
]

const PRIMARY = "oklch(0.7204 0.1507 48)"
const MUTED = "oklch(0.45 0.01 265)"

/* ─── Helpers ───────────────────────────────────────────── */

function formatPrice(amount: number): string {
  if (amount === 0) return "$0"
  const rounded = Math.round(amount * 100) / 100
  return rounded % 1 === 0 ? `$${rounded}` : `$${rounded.toFixed(2)}`
}

function resolveAnnualPrice(monthly: PlanPrice, annual?: PlanPrice): PlanPrice {
  if (annual !== undefined) return annual
  if (typeof monthly === "number") return Math.round(monthly * 0.85 * 100) / 100
  return monthly
}

function getDisplayPrice(plan: ComparisonPlan, period: BillingPeriod): string {
  const { monthly, annual } = plan.price
  if (period === "monthly") {
    return monthly === "Custom" ? "Custom" : formatPrice(monthly)
  }
  const resolved = resolveAnnualPrice(monthly, annual)
  return resolved === "Custom" ? "Custom" : formatPrice(resolved)
}

function isPaidPlan(plan: ComparisonPlan): boolean {
  return typeof plan.price.monthly === "number" && plan.price.monthly > 0
}

function showAnnualDiscount(plan: ComparisonPlan, period: BillingPeriod): boolean {
  if (period !== "annual" || !isPaidPlan(plan)) return false
  const { monthly, annual } = plan.price
  if (typeof monthly !== "number") return false
  const resolved = resolveAnnualPrice(monthly, annual)
  return typeof resolved === "number" && resolved < monthly
}

function getCtaVariant(plan: ComparisonPlan): ComparisonCtaVariant {
  if (!isPaidPlan(plan)) return "outline"
  if (plan.highlighted) return "solid-glow"
  if (plan.id === "team") return "outline"
  return "solid"
}

/* ─── Feature cell ──────────────────────────────────────── */

const FeatureCell: React.FC<{ value: FeatureCellValue }> = ({ value }) => {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center" aria-label="Included">
        <Check size={18} strokeWidth={2.5} style={{ color: PRIMARY }} />
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center" aria-label="Not included">
        <X size={18} strokeWidth={2} style={{ color: MUTED }} />
      </span>
    )
  }
  if (value === "premium") {
    return (
      <div className="comparison-cell-premium">
        <Check size={18} strokeWidth={2.5} style={{ color: PRIMARY }} />
        <span className="comparison-cell-premium-tag">Premium</span>
      </div>
    )
  }
  const str = String(value)
  if (str === "✓ Max") {
    return (
      <div className="comparison-cell-premium">
        <Check size={18} strokeWidth={2.5} style={{ color: PRIMARY }} />
        <span className="comparison-cell-premium-tag">Max</span>
      </div>
    )
  }
  return <span className="comparison-cell-text">{str}</span>
}

/* ─── Billing toggle ─────────────────────────────────────── */

const BillingToggle: React.FC<{
  value: BillingPeriod
  onChange: (p: BillingPeriod) => void
}> = ({ value, onChange }) => {
  const options: { key: BillingPeriod; label: string }[] = [
    { key: "monthly", label: "Monthly" },
    { key: "annual", label: "Annual" },
  ]

  return (
    <div className="comparison-billing-toggle">
      <div className="comparison-billing-pill">
        {options.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "comparison-billing-btn",
              value === key && "is-active"
            )}
            style={{ position: "relative" }}
          >
            {value === key && (
              <motion.span
                layoutId="comparison-billing-pill"
                className="comparison-billing-indicator"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  borderRadius: "9999px",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── ComparisonTable ───────────────────────────────────── */

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  billingToggle = true,
  ctaLabel = "Get Started",
  className,
  onCtaClick,
}) => {
  const [billing, setBilling] = useState<BillingPeriod>("monthly")

  const rows = useMemo(() => {
    const result: Array<
      | { type: "category"; name: string }
      | { type: "feature"; feature: ComparisonFeature }
    > = []
    let lastCategory = ""
    for (const feature of features) {
      if (feature.category !== lastCategory) {
        result.push({ type: "category", name: feature.category })
        lastCategory = feature.category
      }
      result.push({ type: "feature", feature })
    }
    return result
  }, [features])

  let rowIndex = 0

  return (
    <section className={cn("comparison-wrapper", className)}>
      <style dangerouslySetInnerHTML={{ __html: TABLE_STYLES }} />

      {billingToggle && <BillingToggle value={billing} onChange={setBilling} />}

      <div className="comparison-scroll">
        <table className="comparison-table" role="table">
          <thead>
            <tr>
              <th className="col-label" scope="col" aria-hidden />
              {plans.map((plan) => {
                const highlighted = !!plan.highlighted
                const priceStr = getDisplayPrice(plan, billing)
                const isPaid = isPaidPlan(plan)
                const suffix = plan.priceSuffix ?? "/mo"
                const ctaVariant = getCtaVariant(plan)

                return (
                  <th
                    key={plan.id}
                    scope="col"
                    className={cn(
                      "col-plan",
                      highlighted && "col-highlighted col-highlighted-header"
                    )}
                  >
                    {plan.badge && (
                      <span className="comparison-badge">{plan.badge}</span>
                    )}
                    <div className="comparison-plan-name">{plan.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "wrap", gap: "0.2rem" }}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={`${plan.id}-${priceStr}-${billing}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={cn(
                            "comparison-price",
                            isPaid ? "comparison-price-paid" : "comparison-price-free"
                          )}
                        >
                          {priceStr}
                        </motion.span>
                      </AnimatePresence>
                      <span className="comparison-price-suffix">{suffix}</span>
                      {showAnnualDiscount(plan, billing) && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="comparison-discount-badge"
                        >
                          -15%
                        </motion.span>
                      )}
                    </div>
                    <button
                      type="button"
                      className={cn(
                        "comparison-cta",
                        ctaVariant === "outline" && "comparison-cta-outline",
                        ctaVariant === "solid" && "comparison-cta-solid",
                        ctaVariant === "solid-glow" && "comparison-cta-glow"
                      )}
                      onClick={() => onCtaClick?.(plan.id)}
                    >
                      {ctaLabel}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              if (row.type === "category") {
                return (
                  <tr key={`cat-${row.name}`} className="category-row">
                    <td className="col-label" colSpan={plans.length + 1}>
                      {row.name}
                    </td>
                  </tr>
                )
              }

              const { feature } = row
              const alt = rowIndex % 2 === 1
              rowIndex += 1

              return (
                <tr key={`${feature.category}-${feature.label}`} className={alt ? "row-alt" : undefined}>
                  <td
                    className="col-label comparison-cell-text"
                    style={{ fontWeight: 500, color: "oklch(0.75 0.02 265)" }}
                  >
                    <span className="comparison-feature-label">
                      {feature.label}
                      {feature.tooltip && (
                        <Info
                          size={14}
                          className="comparison-tooltip-icon"
                          aria-label={feature.tooltip}
                        />
                      )}
                    </span>
                  </td>
                  {plans.map((plan) => {
                    const cell = feature.values[plan.id] ?? false
                    return (
                      <td
                        key={plan.id}
                        className={cn(plan.highlighted && "col-highlighted")}
                      >
                        <FeatureCell value={cell} />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ComparisonTable
