"use client";

import React, { useState } from "react";

const faqs = [
  {
    q: "What is GwenUI?",
    a: "GwenUI is a full-page block registry for Next.js 16 developers. Instead of atomic components, GwenUI ships complete, production-ready page workflows — authentication flows, dashboards, landing pages — that you install via the CLI and own entirely.",
  },
  {
    q: "How is GwenUI different from shadcn/ui?",
    a: "shadcn/ui gives you atomic components (`Button`, `Input`, `Card`). GwenUI gives you full-page workflow blocks built on top of shadcn/ui — think Auth Login, Dashboard Shell, or Onboarding Flow. They're complementary: GwenUI uses shadcn/ui under the hood.",
  },
  {
    q: "Is GwenUI really free?",
    a: "Yes. GwenUI is free to use for personal and commercial projects under the Elastic License 2.0 (ELv2). The only restriction is that you cannot resell GwenUI blocks or host them as a competing service.",
  },
  {
    q: "How does the CLI work?",
    a: "Run `npx @gwenui/cli add login` in your project. The CLI pulls the block's source code from its standalone GitHub repository and copies it directly into your codebase. No runtime dependency is installed — you own the code from that moment.",
  },
  {
    q: "Do I need to install GwenUI as a runtime dependency?",
    a: "No. Once a block is installed, it has zero dependency on GwenUI at runtime. The CLI is just a bridge. Your project stays lean and fully self-contained.",
  },
  {
    q: "Can I customize the blocks?",
    a: "Absolutely — that's the whole point. Since the code lives in your repository, you can modify every line, swap components, change tokens, or rip out anything you don't need. It's your code.",
  },
  {
    q: "What frameworks are supported?",
    a: "GwenUI blocks are built for Next.js 16 with the App Router. React 19 and TypeScript are assumed. Tailwind CSS v4 and shadcn/ui are required as base dependencies.",
  },
  {
    q: "Is Supreme free to use?",
    a: "Supreme blocks are free for personal use — learning, hobby projects, and portfolio work. Commercial use is not permitted. Supreme is designed as an advanced tier for developers who want to study sophisticated architectural patterns.",
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className="group relative cursor-pointer py-8 border-b border-white/5 transition-all duration-300"
    >
      {/* Lightning bolt icon — left of question, visible when open or hovered */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Lightning bolt animated container */}
          <div
            className="mt-0.5 transition-all duration-300 flex-shrink-0 flex items-center overflow-hidden"
            style={{ 
              opacity: isOpen ? 1 : 0, 
              width: isOpen ? "16px" : "0px",
              marginRight: isOpen ? "4px" : "-12px",
              transform: isOpen ? "translateX(0)" : "translateX(-10px)"
            }}
          >
            <svg width="14" height="16" viewBox="0 0 14 18" fill="none">
              <path
                d="M8 1L1 10H7L6 17L13 8H7L8 1Z"
                fill="var(--primary)"
                stroke="var(--primary)"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Question */}
          <p
            className="text-lg md:text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-white"
            style={{ color: isOpen ? "white" : "var(--muted-foreground)" }}
          >
            {faq.q}
          </p>
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0 mt-1.5 transition-all duration-300">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              color: isOpen ? "var(--primary)" : "var(--border)",
            }}
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Answer — animated height */}
      <div
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          maxHeight: isOpen ? "400px" : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-10px)"
        }}
      >
        <p
          className="text-base md:text-lg leading-relaxed pt-6 max-w-2xl"
          style={{ color: "var(--muted-foreground)" }}
        >
          {/* Inline code styling for backtick content */}
          {faq.a.split(/(`[^`]+`)/g).map((part, i) =>
            part.startsWith("`") && part.endsWith("`") ? (
              <code
                key={i}
                className="text-sm px-2 py-0.5 rounded font-mono mx-1"
                style={{
                  background: "var(--glass)",
                  border: "1px solid var(--active-glass-border)",
                  color: "var(--primary)",
                }}
              >
                {part.slice(1, -1)}
              </code>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative z-10 w-full py-32 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "var(--primary)", filter: "blur(100px)" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-20">
          <p className="text-[11px] uppercase tracking-[0.4em] font-bold mb-6"
            style={{ color: "var(--muted-foreground)" }}
          >
            FAQ
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight heading-gradient-white leading-[1.1]">
            Frequently asked questions.
          </h2>
        </div>

        {/* Accordion list */}
        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
