"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CommandPalette, toggleCommandPalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Blocks", href: "/blocks" },
  { label: "Supreme", href: "/docs/supreme/overview" },
] as const;

type Props = {
  type?: "landing" | "docs";
};

export function Navbar({ type = "landing" }: Props) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isDocs = pathname.startsWith("/docs");

  // Conditional rendering to prevent double navbars:
  // Root layout's "landing" navbar hides when inside docs section.
  // Docs layout's "docs" navbar only renders when inside docs section.
  if (type === "landing" && isDocs) {
    return null;
  }
  if (type === "docs" && !isDocs) {
    return null;
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md flex items-center font-sans"
      style={{
        height: "52px",
        backgroundColor: "var(--docs-nav-bg)",
        borderBottom: "1px solid var(--docs-border-faint)",
      }}
    >
      <div
        className={`mx-auto w-full h-full flex items-center justify-between gap-4 px-6 ${
          type === "docs" ? "max-w-[1400px]" : "max-w-6xl"
        }`}
      >
        {/* Left Side: Logo & Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group no-underline"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Gwen.png"
              alt="GwenUI Logo"
              width={20}
              height={20}
              className="transition-transform group-hover:scale-110 duration-200"
            />
            <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-40 transition-opacity rounded-full" />
          </div>
          <span className="font-sans font-bold text-sm text-[var(--foreground)] tracking-tight">
            GwenUI
          </span>
        </Link>

        {/* Center: Nav links (Pill hover, subtle underline on active) */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/docs"
                ? pathname === "/docs" || (pathname.startsWith("/docs/") && !pathname.startsWith("/docs/supreme/"))
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 flex items-center justify-center"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  color: active || hoveredLink === link.href ? "var(--foreground)" : "var(--docs-text-body)",
                }}
              >
                {/* Pill Hover Background */}
                {hoveredLink === link.href && (
                  <motion.span
                    layoutId="hoverPill"
                    className="absolute inset-0 bg-[var(--hover-glass)] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}

                <span className="relative z-10 flex items-center">
                  {link.label}
                  {/* Subtle Orange Underline on Active */}
                  {active && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute -bottom-1.5 left-1 right-1 h-[2px] rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Search and Github Button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Button */}
          <button
            type="button"
            onClick={() => toggleCommandPalette(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg text-[13px] transition-all cursor-pointer bg-[var(--docs-elem-surface)] hover:bg-[var(--docs-elem-surface-strong)] border border-[var(--docs-border-faint)] hover:border-[var(--docs-border)] text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] h-8"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="opacity-80">
              <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M8.5 8.5L11 11"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-medium">Search</span>
            <kbd className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--docs-elem-surface)] border border-[var(--docs-border-faint)] text-[var(--docs-text-dim)] font-mono">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />

          {/* GitHub Button */}
          <a
            href="https://github.com/JinXSuper/gwenui"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shadow inline-flex items-center justify-center gap-1.5 px-4 h-8 rounded-full font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.04] active:scale-[0.98]"
            style={{
              backgroundColor: "var(--primary)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="text-primary-foreground">GitHub</span>
          </a>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-1.5 rounded-lg text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--hover-glass)] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[52px] left-0 right-0 z-40 py-6 px-6 flex flex-col gap-5 md:hidden border-b border-[var(--docs-border-faint)]"
            style={{
              backgroundColor: "var(--docs-nav-bg)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/docs"
                    ? pathname === "/docs" || (pathname.startsWith("/docs/") && !pathname.startsWith("/docs/supreme/"))
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold transition-colors py-2 flex items-center justify-between"
                    style={{
                      color: active ? "var(--foreground)" : "var(--docs-text-body)",
                    }}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--primary)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div
              className="h-[1px]"
              style={{ backgroundColor: "var(--docs-border-faint)" }}
            />

            <div className="flex flex-col gap-3">
              {/* Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleCommandPalette(true);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer bg-[var(--docs-elem-surface)] hover:bg-[var(--docs-elem-surface-strong)] border border-[var(--docs-border-faint)] text-[var(--docs-text-faint)] hover:text-[var(--docs-text-heading)] w-full justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                  <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="M8.5 8.5L11 11"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium">Search documentation</span>
              </button>

              <ThemeToggle className="w-full justify-center" />

              {/* GitHub Button */}
              <a
                href="https://github.com/JinXSuper/gwenui"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-bold text-sm text-primary-foreground hover:bg-primary/90 transition-all"
                style={{
                  backgroundColor: "var(--primary)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-primary-foreground">GitHub Repository</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
      <CommandPalette />
    </>
  );
}
