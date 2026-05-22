"use client";

import React, { useState, useEffect } from "react";

export function OpenSourceCTA() {
  const [stars, setStars] = useState<number>(0);
  const [isLoadingStars, setIsLoadingStars] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/JinXSuper/gwenui")
      .then((res) => res.json())
      .then((data) => {
        setStars(data.stargazers_count ?? 0);
        setIsLoadingStars(false);
      })
      .catch(() => {
        setStars(0);
        setIsLoadingStars(false);
      });
  }, []);

  return (
    <section className="relative z-10 w-full py-48 px-6 overflow-hidden">
      {/* Subtle ambient glow behind headline */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[600px] h-[300px] rounded-full opacity-[0.04]"
          style={{ background: "var(--primary)", filter: "blur(120px)" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Label */}
        <p 
          className="text-[11px] uppercase tracking-[0.4em] font-bold mb-10"
          style={{ color: "var(--muted-foreground)" }}
        >
          Open Source
        </p>

        {/* Headline */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] mb-10">
          <span className="heading-gradient-white">Everything is open.</span>
          <br />
          <span className="heading-gradient-orange">Nothing is locked.</span>
        </h2>

        {/* Description */}
        <p 
          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-16"
          style={{ color: "var(--muted-foreground)" }}
        >
          Every GwenUI block lives in its own standalone repository — self-contained,
          fully owned by you the moment you install it. No monorepo bloat, no hidden
          dependencies, no vendor lock-in. The CLI is just a bridge. Licensed under
          MIT + BSL 1.1.
        </p>

        {/* Inline Stat Row */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* GitHub Stars */}
          <a
            href="https://github.com/JinXSuper/gwenui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group transition-all duration-150"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              className="transition-colors"
              style={{ color: "var(--muted-foreground)" }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"
              />
            </svg>
            <span className="text-sm font-medium tabular-nums group-hover:text-white transition-colors"
              style={{ color: "var(--muted-foreground)" }}
            >
              {isLoadingStars ? (
                <span className="inline-block w-6 h-3 rounded animate-pulse"
                  style={{ background: "var(--border)" }}
                />
              ) : (
                <>{stars} stars</>
              )}
            </span>
          </a>

          {/* Dot separator */}
          <span className="w-1 h-1 rounded-full" style={{ background: "var(--border)" }} />

          {/* License */}
          <a
            href="https://opensource.org/license/mit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "var(--muted-foreground)" }}
          >
            MIT + BSL 1.1
          </a>

          {/* Dot separator */}
          <span className="w-1 h-1 rounded-full" style={{ background: "var(--border)" }} />

          {/* View on GitHub */}
          <a
            href="https://github.com/JinXSuper/gwenui"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium group transition-colors"
            style={{ color: "var(--primary)" }}
          >
            View on GitHub
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            >
              <path d="M1 11L11 1M11 1H4M11 1V8"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
