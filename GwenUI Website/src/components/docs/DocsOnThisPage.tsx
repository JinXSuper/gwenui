"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type Heading = { id: string; label: string; level: number };

export function DocsOnThisPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Scrape headings directly from DOM
    const elements = document.querySelectorAll("[data-mdx-content] h2, [data-mdx-content] h3");
    const found: Heading[] = [];

    elements.forEach((el) => {
      if (!el.id) {
        // Standard slugification fallback if slug doesn't exist
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim() ?? "";
      }
      found.push({
        id: el.id,
        label: el.textContent ?? "",
        level: parseInt(el.tagName.replace("H", ""), 10),
      });
    });

    setHeadings(found);
  }, [pathname]);

  useEffect(() => {
    if (headings.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-10% 0% -70% 0%" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="w-full">
      <div className="mb-6">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 flex items-center gap-1.5"
          style={{ color: "var(--docs-text-faint)" }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path
              d="M1 1.5h9M1 5.5h6M1 9.5h8"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
          On this page
        </p>

        <div className="relative ml-[5px]">
          {/* Vertical continuous line track */}
          <div className="absolute top-0 bottom-0 left-[0.5px] w-[1px] bg-[var(--primary)]/30 rounded-full" />
          
          <ul className="flex flex-col gap-1.5 relative z-10">
            {headings.map((h) => {
              const isActive = active === h.id;
              const isH3 = h.level === 3;
              // Strip trailing '#' if it exists
              const cleanLabel = h.label.replace(/#$/, '').trim();

              return (
                <li key={h.id} className="relative">
                  {/* Smooth animated active indicator line */}
                  {isActive && (
                    <motion.div
                      layoutId="toc-indicator"
                      className="absolute left-[0px] top-[4px] bottom-[4px] w-[2px] bg-[var(--primary)] rounded-full z-20 shadow-[0_0_8px_var(--primary)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Horizontal tick for H3 items */}
                  {isH3 && (
                    <div className="absolute left-[2px] top-[13px] w-[12px] h-[1px] bg-[var(--primary)]/30" />
                  )}
                  <a
                    href={`#${h.id}`}
                    className="text-[12px] leading-relaxed transition-all duration-150 block py-1 hover:text-[var(--primary)]"
                    style={{
                      paddingLeft: isH3 ? "20px" : "12px",
                      color: isActive ? "var(--primary)" : "var(--muted-foreground)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {cleanLabel}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="h-px my-5" style={{ background: "var(--docs-border-faint)" }} />

      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: "var(--docs-text-faint)" }}
        >
          Contribute
        </p>
        <ul className="flex flex-col gap-2">
          {[
            {
              icon: "⚑",
              label: "Report an issue",
              href: "https://github.com/JinXSuper/gwenui/issues/new?template=bug_report",
            },
            {
              icon: "✦",
              label: "Request a feature",
              href: "https://github.com/JinXSuper/gwenui/issues/new?template=feature_request",
            },
            {
              icon: "✎",
              label: "Edit this page",
              href: "https://github.com/JinXSuper/gwenui",
            },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[12px] transition-colors hover:text-[var(--docs-text-heading)]"
                style={{ color: "var(--docs-text-muted)" }}
              >
                <span className="text-[10px]">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
