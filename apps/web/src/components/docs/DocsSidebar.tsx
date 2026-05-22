"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/app/docs/nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[240px] h-full flex flex-col justify-between text-sidebar-foreground font-sans bg-transparent">
      {/* Scrollable Nav Items list */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col custom-scrollbar bg-transparent">
        {nav.map((section) => (
          <div key={section.group} className="flex flex-col gap-1.5 mt-6 first:mt-0">
            {/* Group Title header */}
            <div className="flex items-center justify-between px-0 mb-2">
              <span className="text-[0.625rem] font-bold tracking-[0.08em] text-[var(--docs-text-faint)] uppercase">
                {section.group}
              </span>
              {section.badge && (
                <span className="pill-badge text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {section.badge}
                </span>
              )}
            </div>

            {/* Items list (NOT numbered) */}
            <ul className="flex flex-col">
              {section.items.map((item) => {
                const active = pathname === item.href;
                const isExternal = (item as any).external;
                const className = `block text-[13px] py-1.5 transition-all duration-150 rounded-none bg-transparent hover:bg-transparent ${active
                    ? "border-l-2 border-[var(--primary)] pl-[0.8125rem] text-[var(--primary)] font-medium"
                    : "border-l border-[oklch(100%_0_0_/_10%)] hover:border-[oklch(100%_0_0_/_20%)] pl-[0.875rem] text-[var(--docs-text-muted)] hover:text-[var(--foreground)] font-normal"
                  }`;

                return (
                  <li key={item.href}>
                    {isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={className}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sticky Bottom Area */}
      <div className="px-5 py-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground/50 font-mono select-none bg-transparent">
        <span>v0.1.0</span>
        <a
          href="https://github.com/JinXSuper/gwenui"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors flex items-center gap-0.5 group"
        >
          GitHub <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </a>
      </div>
    </div>
  );
}
