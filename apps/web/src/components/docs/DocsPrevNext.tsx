"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { allItems } from "@/app/docs/nav";

export function DocsPrevNext() {
  const pathname = usePathname();
  const idx = allItems.findIndex((i) => i.href === pathname);
  const prev = idx > 0 ? allItems[idx - 1] : null;
  const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;

  return (
    <div
      className="flex items-center justify-between gap-4 mt-16 pt-8 border-t"
      style={{ borderColor: "var(--docs-border-faint)" }}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 p-4 rounded-xl border transition-all duration-200 max-w-[48%]"
          style={{
            borderColor: "var(--docs-border)",
            background: "var(--docs-card-bg)",
          }}
        >
          <span className="text-[11px]" style={{ color: "var(--docs-text-dim)" }}>
            ← Previous
          </span>
          <span
            className="text-[13px] font-medium transition-colors group-hover:text-orange-400"
            style={{ color: "var(--docs-text-body)" }}
          >
            {prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col gap-1 p-4 rounded-xl border transition-all duration-200 text-right max-w-[48%] ml-auto"
          style={{
            borderColor: "var(--docs-border)",
            background: "var(--docs-card-bg)",
          }}
        >
          <span className="text-[11px]" style={{ color: "var(--docs-text-dim)" }}>
            Next →
          </span>
          <span
            className="text-[13px] font-medium transition-colors group-hover:text-orange-400"
            style={{ color: "var(--docs-text-body)" }}
          >
            {next.label}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
