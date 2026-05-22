---
name: landing-page-hierarchy
description: Landing page section hierarchy and copywriting patterns. Use when building, planning, or reviewing a landing page — covers hero, features, social proof, CTA, and all major sections with copy rules.
license: MIT
metadata:
  version: 1.0.0
  author: JinXSuper
---

# GwenUI — Landing Page Hierarchy SKILL

## Overview

Standard guide for building landing pages with GwenUI — section hierarchy,
visual weight, copywriting patterns, and best practices. Generic for any project.

---

## Core Philosophy

A landing page is not a collection of random sections. Each section must answer
a specific question in the visitor's mind:

```
"What is this?"                 → Hero
"Why should I care?"            → Value Proposition / Features
"Where is the proof?"           → Social Proof / Showcase
"How do I use it?"              → How it Works / Demo
"How much does it cost?"        → Pricing (if any)
"What are the common questions?"→ FAQ (if any)
"What should I do now?"         → CTA
```

Order sections based on the visitor's **urgency of questions**, not personal preference.

---

## Section Library

Choose relevant sections and organize them based on project requirements.
Use existing GwenUI blocks, and build from scratch only if unavailable.

---

### 1. Navbar

**Always present.** Fixed or sticky at the top.

```
[Logo]                    [Docs] [Blocks] [GitHub]  [Get Started →]
```

Rules:
- Max 4-5 nav links — avoid being cramped
- CTA button on the right, `bg-primary` color
- Mobile: hamburger menu or drawer
- Transparent over hero, solid after scrolling (if dark bg hero)

```tsx
<nav className="fixed top-0 inset-x-0 z-50 border-b border-border backdrop-blur-md bg-background/80">
```

---

### 2. Hero

**Always present. The most important section.**

Function: answers "what is this?" within the first 3 seconds.

#### Anatomy of an effective Hero

```
[Eyebrow / Badge]          ← optional, category/positioning
[Headline]                 ← 4-8 words, bold, large
[Subheadline]              ← 1-2 sentences, expands the headline
[CTA Buttons]              ← primary + secondary
[Visual / Preview]         ← screenshot, demo, illustration
```

#### Copywriting Rules

```
// Headline — concrete, not generic
"A dark-first block library for React"    ✅
"Build better products faster"            ❌ (too generic)

// Subheadline — expand, do not repeat
"50+ production-ready blocks. Dark mode by default.
 Pins to any Next.js project in seconds."           ✅

// CTA — action word + benefit
"Get started for free"    ✅
"Browse blocks"           ✅
"Submit"                  ❌ (no benefit)
```

#### Visual Options

| Visual | When to Use |
|--------|-------------|
| Product screenshot | SaaS, app, dashboard |
| Block/component preview (iframe) | Component library |
| Illustration/3D | Developer tool, abstract product |
| Video/GIF demo | Product with complex interactions |
| Code snippet | Dev tool, CLI, API |
| No visual (centered text) | Simple landing, coming soon |

```tsx
<section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
  <Badge>Now in Beta</Badge>
  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-4">
    Dark-first blocks for React
  </h1>
  <p className="text-lg text-muted-foreground mt-4 max-w-xl">
    50+ production-ready sections. GwenUI tokens built-in.
    Drop into any Next.js project in seconds.
  </p>
  <div className="flex gap-3 mt-8">
    <Button variant="primary">Browse blocks</Button>
    <Button variant="outline">View on GitHub</Button>
  </div>
</section>
```

---

### 3. Social Proof / Logo Bar

**Highly recommended** — builds trust before the visitor scrolls further.

Place right after the hero, before features.

If you don't have customers/users yet:
- Use "Built with" — tech logos (Next.js, Tailwind, Framer Motion)
- Use GitHub stars counter
- Use npm download count

```tsx
<section className="py-12 border-y border-border">
  <p className="text-xs text-muted-foreground text-center uppercase tracking-widest mb-8">
    Trusted by teams at
  </p>
  <div className="flex items-center justify-center gap-12 opacity-40 grayscale">
    {logos.map((logo) => <img key={logo.name} src={logo.src} alt={logo.name} />)}
  </div>
</section>
```

---

### 4. Value Proposition / Features

Answers "why should I care?" — 3-6 key features, not a laundry list.

#### Copywriting Rules

```
// Feature title — noun or short verb phrase
"Dark by default"      ✅
"Fully responsive"     ✅

// Feature description — 1-2 sentences, benefit-focused
"Every block ships with Gwen Noir theme. No configuration needed."    ✅
"Our blocks are built with dark mode in mind and use OKLCH tokens."   ❌ (technical)
```

```tsx
<section className="py-24 px-4">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
      Everything you need
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div key={feature.title} className="p-6 rounded-xl border border-border bg-card">
          <feature.icon className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### 5. Product Showcase / Demo

Show the product in action — don't just tell stories.

Options:
- **Block preview grid** — screenshots/iframes of available blocks
- **Interactive demo** — immediately tryable
- **Before/After slider** — comparison
- **Video embed** — demo walkthrough

---

### 6. How it Works

Optional — use if the product requires flow/process explanation. Max 3-4 steps.

```tsx
<section className="py-24 px-4">
  <h2 className="text-3xl font-bold text-center tracking-tight mb-16">
    Up and running in minutes
  </h2>
  <div className="flex flex-col md:flex-row items-start gap-8 max-w-4xl mx-auto">
    {steps.map((step, i) => (
      <div key={i} className="flex-1">
        <span className="text-xs font-semibold text-primary tracking-widest uppercase">
          Step {i + 1}
        </span>
        <h3 className="text-lg font-semibold mt-2 mb-1">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>
    ))}
  </div>
</section>
```

---

### 7. Testimonials

Deeper social proof. Use if you already have real users.
Layout: masonry grid or carousel. Min 3, max 9 on the main page.

---

### 8. Pricing

Use if it's a paid product. Max 3 tiers — Free / Pro / Enterprise.
Highlight recommended tier with `border-primary`.

---

### 9. FAQ

Optional. Max 6-8 questions. Use the Accordion component.

---

### 10. Final CTA

**Always present.** The last section before the footer.

```tsx
<section className="py-32 px-4 text-center">
  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
    Start building today.
  </h2>
  <p className="text-muted-foreground mt-4 mb-8">
    Free to use. Open source. No credit card required.
  </p>
  <Button size="lg" variant="primary">
    Browse blocks →
  </Button>
</section>
```

---

### 11. Footer

**Always present.**

```
[Logo + tagline]     [Links col]  [Links col]  [Social icons]
[Copyright]
```

---

## Section Priority Matrix

| Section | Developer Tool | SaaS | Component Library |
|---------|---------------|------|-------------------|
| Navbar | Required | Required | Required |
| Hero | Required | Required | Required |
| Logo Bar / Social Proof | Optional | Recommended | Optional |
| Features | Required | Required | Recommended |
| Showcase / Demo | Required | Recommended | Required |
| How it Works | Recommended | Optional | Optional |
| Testimonials | Optional | Recommended | Optional |
| Pricing | Not needed | Required | Optional |
| FAQ | Optional | Recommended | Optional |
| Final CTA | Required | Required | Required |
| Footer | Required | Required | Required |

---

## Visual Rhythm Rules

- **Vertical spacing** between sections: `py-24` minimum, `py-32` for emphasis
- **Section width:** max `max-w-6xl` for wide content, `max-w-3xl` for text-heavy
- **Alternating bg:** vary `bg-background` and `bg-card` between sections
- **Dividers:** `border-y border-border` for sections requiring clear separators

---

## Checklist Before Done

- [ ] Navbar present — logo + nav links + CTA button
- [ ] Hero answers "what is this?" within 3 seconds
- [ ] Concrete headline, not generic
- [ ] CTA button present — clear primary action
- [ ] Sections ordered by customer journey (awareness → consideration → decision)
- [ ] Final CTA present before footer
- [ ] Footer present
- [ ] All sections fully responsive
- [ ] Framer Motion entrance animation in every section (useInView)
- [ ] No more than 4 different CTAs on a single page
- [ ] Benefit-focused copy, not feature-focused
