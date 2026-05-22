"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/app/docs/nav";

export function DocsBreadcrumb() {
  const pathname = usePathname();
  let group = "";
  let label = "";

  for (const section of nav) {
    for (const item of section.items) {
      if (item.href === pathname) {
        group = section.group;
        label = item.label;
        break;
      }
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-[12px] mb-5">
      <Link
        href="/docs"
        className="transition-colors hover:text-[var(--docs-text-heading)]"
        style={{ color: "var(--docs-text-dim)" }}
      >
        Docs
      </Link>
      <span style={{ color: "var(--docs-text-faint)" }}>/</span>
      <span style={{ color: "var(--docs-text-dim)" }}>{group}</span>
      <span style={{ color: "var(--docs-text-faint)" }}>/</span>
      <span style={{ color: "var(--docs-text-heading)" }}>{label}</span>
    </div>
  );
}
