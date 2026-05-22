/**
 * Block: Dynamic Pricing
 * Author: Implemented by JinXSuper
 * License: MIT
 */
"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircleCheck, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type Period = "monthly" | "annually" | "lifetime"
const PERIOD_ORDER: Period[] = ["monthly", "annually", "lifetime"]

// --- SlotDigit ---
const SlotDigit: React.FC<{
  digit: string
  delay?: number
  direction?: "up" | "down"
  scrambleDuration?: number
}> = ({ digit, delay = 0, scrambleDuration = 3 }) => {
  const isNumeric = /[0-9]/.test(digit)
  const itemHeight = 48 // px
  
  const [displayDigit, setDisplayDigit] = useState(digit)
  const hasMounted = useRef(false)

  // Mount-time Scramble Animation
  useEffect(() => {
    if (!isNumeric) {
      setDisplayDigit(digit)
      return
    }

    if (hasMounted.current) {
      setDisplayDigit(digit)
      return
    }

    hasMounted.current = true
    const baseDuration = scrambleDuration * 1000
    const duration = baseDuration + delay * 400 * (scrambleDuration / 0.3)
    const intervalTime = 50 // speed of scramble
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed += intervalTime
      if (elapsed >= duration) {
        setDisplayDigit(digit)
        clearInterval(interval)
      } else {
        const randomDigit = Math.floor(Math.random() * 10).toString()
        setDisplayDigit(randomDigit)
      }
    }, intervalTime)

    return () => clearInterval(interval)
  }, [digit, delay, isNumeric, scrambleDuration])

  if (!isNumeric) {
    return (
      <span 
        className="text-4xl font-bold select-none text-foreground flex items-center justify-center leading-none" 
        style={{ height: itemHeight }}
      >
        {digit}
      </span>
    )
  }

  const digitIndex = parseInt(displayDigit)
  const totalDigits = 10

  return (
    <div 
      className="overflow-hidden relative select-none text-4xl font-bold text-foreground flex items-center justify-center leading-none" 
      style={{ height: itemHeight, width: "0.62em" }}
    >
      <motion.div
        animate={{ y: -(digitIndex * itemHeight) }}
        initial={false}
        transition={{ type: "spring", stiffness: 150, damping: 22, mass: 0.8 }}
        className="absolute left-0 w-full flex flex-col"
        style={{ top: 0 }}
      >
        {Array.from({ length: totalDigits }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-center leading-none"
            style={{ height: itemHeight }}
          >
            {i}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// --- PriceDisplay ---
const PriceDisplay: React.FC<{
  value: number
  currency: string
  period: Period
  direction: "up" | "down"
  scrambleDuration: number
}> = ({ value, currency, period, direction, scrambleDuration }) => {
  const digits = Math.round(value).toString().split("")
  return (
    <div className="flex items-end gap-0.5">
      <span className="text-xl text-muted-foreground mb-2">{currency}</span>
      <div className="flex overflow-hidden">
        {digits.map((d, i) => (
          <SlotDigit 
            key={`${i}`} 
            digit={d} 
            delay={i * 0.04} 
            direction={direction} 
            scrambleDuration={scrambleDuration}
          />
        ))}
      </div>
      {period !== "lifetime" && (
        <span className="text-sm text-muted-foreground mb-2 ml-0.5">/month</span>
      )}
    </div>
  )
}

// --- BillingToggle ---
const BillingToggle: React.FC<{
  value: Period
  onChange: (p: Period) => void
  discount: number
}> = ({ value, onChange, discount }) => {
  const options = [
    { key: "monthly"  as Period, label: "Monthly"  },
    { key: "annually" as Period, label: "Annually" },
    { key: "lifetime" as Period, label: "Lifetime" },
  ]
  return (
    <div className="flex flex-col items-center gap-2 mb-12">
      <div className="relative flex bg-muted rounded-full p-1 border border-border/10">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "relative z-10 px-5 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer outline-none",
              value === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {value === key && (
              <motion.div
                layoutId="billing-pill"
                className="absolute inset-0 bg-primary rounded-full"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {value === "annually" && (
          <motion.p
            key="annually-hint"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-xs text-primary font-medium"
          >
            Save {discount}% vs monthly
          </motion.p>
        )}
        {value === "lifetime" && (
          <motion.p
            key="lifetime-hint"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-xs text-muted-foreground"
          >
            One-time payment · Pay once, own forever
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- DynamicPricing Props & Types ---
export interface PricingPlan {
  name: string
  description?: string
  monthly: number
  features: string[]
  featuresLabel?: string
  featuresNote?: string
  cta?: string
  highlighted?: boolean
}

export interface DynamicPricingProps {
  plans?: PricingPlan[]
  title?: string
  subtitle?: string
  currency?: string
  discount?: number
  lifetimeMultiplier?: number
  className?: string
  scrambleDuration?: number
}

export const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for individuals and small teams getting started",
    monthly: 29,
    features: [
      "Understanding Your Business Context",
      "Insights into Your Business Environment",
      "Overview of Your Business Landscape",
      "Business Context Analysis",
      "Exploring Your Business Context",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    description: "Perfect for individuals and small teams getting started",
    monthly: 99,
    highlighted: true,
    featuresNote: "Everything in Basic Plus",
    features: [
      "Understanding Your Business Context",
      "Insights into Your Business Environment",
      "Overview of Your Business Landscape",
      "Business Context Analysis",
      "Exploring Your Business Context",
      "Business Context Overview",
    ],
    cta: "Get Started",
  },
  {
    name: "Business",
    description: "Perfect for individuals and small teams getting started",
    monthly: 299,
    features: [
      "Understanding Your Business Context",
      "Insights into Your Business Environment",
      "Overview of Your Business Landscape",
      "Business Context Analysis",
      "Exploring Your Business Context",
      "Business Context Overview",
    ],
    cta: "Get Started",
  },
]

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

// --- DynamicPricing ---
export const DynamicPricing: React.FC<DynamicPricingProps> = ({
  plans = DEFAULT_PLANS,
  title = "Simple, Transparent Pricing",
  subtitle = "Choose the perfect plan for your needs.",
  currency = "$",
  discount = 20,
  lifetimeMultiplier = 30,
  className,
  scrambleDuration = 0.3,
}) => {
  const [period, setPeriod] = useState<Period>("monthly")
  const prevPeriod = useRef<Period>("monthly")
  const direction = PERIOD_ORDER.indexOf(period) > PERIOD_ORDER.indexOf(prevPeriod.current) ? "down" : "up"

  const handleChange = (p: Period) => {
    prevPeriod.current = period
    setPeriod(p)
  }

  const getPrice = (monthly: number) => {
    if (period === "monthly") return monthly
    if (period === "annually") return monthly * (1 - discount / 100)
    return monthly * lifetimeMultiplier
  }

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
      className={cn("relative w-full py-24 px-6 overflow-hidden bg-[#07060e]", className)}
    >
      {/* Background glow — deep violet/blue, purely decorative */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, hsl(var(--primary) / 0.13) 0%, transparent 65%), " +
            "radial-gradient(ellipse 50% 40% at 15% 85%, hsl(240 70% 25% / 0.22) 0%, transparent 55%), " +
            "radial-gradient(ellipse 40% 30% at 85% 75%, hsl(260 60% 20% / 0.18) 0%, transparent 50%)",
        }}
      />

      {/* Section header */}
      <motion.div variants={itemVariants} className="flex flex-col items-center gap-3 mb-10">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          Pricing
        </span>
        <h2 className="text-4xl font-bold text-foreground text-center">{title}</h2>
        <p className="text-muted-foreground text-center max-w-md text-sm">{subtitle}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <BillingToggle value={period} onChange={handleChange} discount={discount} />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={cn(
              "relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300",
              plan.highlighted 
                ? "md:-translate-y-2 md:scale-[1.02] z-10" 
                : "border border-border bg-card"
            )}
            style={plan.highlighted ? {
              background: "linear-gradient(160deg, hsl(20 15% 12%) 0%, hsl(25 20% 9%) 100%)",
              border: "1.5px solid color-mix(in srgb, var(--primary) 60%, transparent)",
              boxShadow:
                "0 0 0 1px color-mix(in srgb, var(--primary) 15%, transparent), " +
                "0 0 60px color-mix(in srgb, var(--primary) 18%, transparent), " +
                "0 0 120px color-mix(in srgb, var(--primary) 8%, transparent), " +
                "inset 0 1px 0 hsl(0 0% 100% / 0.08)",
            } : undefined}
          >
            {plan.highlighted && (
              <span
                className="absolute -top-3.5 right-5 text-xs font-semibold px-4 py-1.5 rounded-full animate-none bg-primary text-primary-foreground"
                style={{
                  boxShadow: "0 0 20px var(--primary)",
                }}
              >
                Popular
              </span>
            )}

            <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>

            <PriceDisplay
              value={getPrice(plan.monthly)}
              currency={currency}
              period={period}
              direction={direction}
              scrambleDuration={scrambleDuration}
            />

            {plan.description && (
              <p className="text-sm text-muted-foreground -mt-2">{plan.description}</p>
            )}

            <button
              className={cn(
                "w-full py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer outline-none active:scale-[0.98]",
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-transparent hover:bg-muted text-foreground"
              )}
            >
              {plan.cta ?? "Get Started"}
            </button>

            <div className="h-px bg-border/50 my-1" />

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground">
                {plan.featuresLabel ?? "FEATURES"}
              </p>
              {plan.featuresNote && (
                <p className="text-sm text-foreground/80">{plan.featuresNote}</p>
              )}
              <ul className="flex flex-col gap-3 mt-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CircleCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

export default DynamicPricing
