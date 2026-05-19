"use client";

import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Docs", href: "/docs" },
    { label: "Blocks", href: "/blocks" },
    { label: "Supreme", href: "/supreme" },
    { label: "CLI", href: "/cli" },
  ],
  Resources: [
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Apache 2.0", href: "https://www.apache.org/licenses/LICENSE-2.0", external: true },
    { label: "ELv2 (Refined)", href: "https://www.elastic.co/licensing/elastic-license", external: true },
  ],
  Connect: [
    { label: "GitHub", href: "https://github.com/JinXSuper/gwenui", external: true },
    { label: "X @JinXSuperDev", href: "https://x.com/JinXSuperDev", external: true },
    { label: "JinXSuper", href: "https://github.com/JinXSuper", external: true },
  ],
};

export function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/5 bg-background py-20 px-6 mt-32">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand col — spans 2 */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              {/* GwenUI orange diamond logo mark */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 1L19 10L10 19L1 10L10 1Z" fill="var(--primary)" />
                <path d="M10 5L15 10L10 15L5 10L10 5Z" fill="var(--background)" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-white">GwenUI</span>
            </div>

            <p className="text-sm text-white/40 max-w-[260px] leading-relaxed">
              High-performance React blocks for developers who hate re-inventing the wheel.
              Open-source, accessible, and battle-tested.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {/* GitHub */}
              <a
                href="https://github.com/JinXSuper/gwenui"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/50 group-hover:text-orange-400 transition-colors">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/JinXSuperDev"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200"
                aria-label="X (Twitter)"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-white/50 group-hover:text-orange-400 transition-colors">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
                </svg>
              </a>

              {/* npm */}
              <a
                href="https://www.npmjs.com/org/gwenui"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200"
                aria-label="npm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/50 group-hover:text-orange-400 transition-colors">
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">
                {section}
              </span>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/50 hover:text-orange-400 transition-colors duration-150 flex items-center gap-1.5 group"
                      >
                        {link.label}
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-px"
                        >
                          <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 hover:text-orange-400 transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Install CTA strip */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm text-white/60">
              Ready to ship? Start with one command.
            </span>
          </div>
          <code className="text-sm font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg tracking-wide">
            npx @gwenui/cli init
          </code>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-white/20 uppercase tracking-[0.2em]">
              © 2026 JinXSuper Projects. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-1 text-[12px] text-white/20">
            <span>Built with</span>
            <span className="text-orange-500/60 mx-0.5">♥</span>
            <span>by</span>
            <a
              href="https://github.com/JinXSuper"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-orange-400 transition-colors ml-1 font-medium"
            >
              JinXSuper
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
