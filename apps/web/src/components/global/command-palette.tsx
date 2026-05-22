"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, File, Box } from "lucide-react";

export interface CommandPaletteItem {
  group: string;
  label: string;
  href: string;
  icon: "File" | "Box";
  path: string;
}

const COMMAND_PALETTE_ITEMS: CommandPaletteItem[] = [
  // Group: GETTING STARTED
  { group: "GETTING STARTED", label: "Introduction", href: "/docs/introduction", icon: "File", path: "docs > introduction" },
  { group: "GETTING STARTED", label: "Installation", href: "/docs/installation", icon: "File", path: "docs > installation" },
  { group: "GETTING STARTED", label: "Quick Start", href: "/docs/quick-start", icon: "File", path: "docs > quick-start" },

  // Group: CLI
  { group: "CLI", label: "Overview", href: "/docs/cli", icon: "Box", path: "docs > cli" },
  { group: "CLI", label: "init", href: "/docs/cli/init", icon: "Box", path: "docs > cli > init" },
  { group: "CLI", label: "add", href: "/docs/cli/add", icon: "Box", path: "docs > cli > add" },
  { group: "CLI", label: "Global Config", href: "/docs/cli/config", icon: "Box", path: "docs > cli > config" },

  // Group: BLOCKS
  { group: "BLOCKS", label: "Auth — Login", href: "/docs/blocks/login", icon: "Box", path: "docs > blocks > login" },
  { group: "BLOCKS", label: "Grainient", href: "/docs/blocks/grainient", icon: "Box", path: "docs > blocks > grainient" },

  // Group: PACKAGES
  { group: "PACKAGES", label: "@gwenui/react", href: "/docs/packages/react", icon: "Box", path: "docs > packages > react" },
  { group: "PACKAGES", label: "@gwenui/supreme", href: "/docs/packages/supreme", icon: "Box", path: "docs > packages > supreme" },
];

export function toggleCommandPalette(open?: boolean) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("toggle-command-palette", { detail: { open } })
    );
  }
}

export function useCommandPalette() {
  return {
    toggle: (open?: boolean) => toggleCommandPalette(open),
  };
}

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Subscribe to trigger events
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.open === "boolean") {
        setIsOpen(customEvent.detail.open);
      } else {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("toggle-command-palette", handleToggle);
    return () => {
      window.removeEventListener("toggle-command-palette", handleToggle);
    };
  }, []);

  // Global KBD Trigger listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Reset values when closed/opened
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items based on case-insensitive search
  const filteredItems = COMMAND_PALETTE_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Reset selected item on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Active elements list
  const groups = Array.from(new Set(filteredItems.map((item) => item.group)));

  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = activeItemRef.current;

      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elemTop = element.offsetTop;
      const elemBottom = elemTop + element.clientHeight;

      if (elemTop < containerTop) {
        container.scrollTop = elemTop;
      } else if (elemBottom > containerBottom) {
        container.scrollTop = elemBottom - container.clientHeight;
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen || filteredItems.length === 0) return;

    const handleNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          router.push(selected.href);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => {
      window.removeEventListener("keydown", handleNav);
    };
  }, [isOpen, filteredItems, selectedIndex, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Frosted glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[oklch(0%_0_0_/_60%)] backdrop-blur-sm"
          />

          {/* Modal content block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-full max-w-[560px] overflow-hidden rounded-[16px] bg-[var(--surface)] backdrop-blur-md flex flex-col z-10"
            style={{
              border: "var(--border-dashed)",
              boxShadow: "var(--shadow-tier-4), 0 0 80px oklch(0% 0 0 / 40%)",
            }}
          >
            {/* Lightning top-edge shine (Tier 4: lightning-md) */}
            <span 
              className="absolute top-0 left-[20%] right-[20%] h-[1px] pointer-events-none z-[1]"
              style={{ background: "var(--lightning-md)" }}
            />
            {/* Header Search Field */}
            <div className="flex items-center h-[52px] px-4 border-b border-[var(--docs-border)]">
              <Search size={18} className="text-[var(--docs-text-faint)] mr-3 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search docs, blocks, components..."
                className="flex-1 bg-transparent border-0 outline-none text-[var(--docs-text-heading)] text-[15px] font-sans placeholder:text-[var(--docs-text-dim)] h-full"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--docs-elem-surface)] border border-[var(--docs-border-faint)] text-[var(--docs-text-dim)] hover:text-[var(--docs-text-heading)] transition-colors cursor-pointer select-none"
              >
                Esc
              </button>
            </div>

            {/* Results listing section */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto max-h-[400px] py-3 flex flex-col custom-scrollbar relative"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-[13px] text-[var(--docs-text-faint)] font-sans">
                  No results for "<span className="text-[var(--docs-text-heading)] font-medium">{query}</span>"
                </div>
              ) : (
                groups.map((group) => {
                  const groupItems = filteredItems.filter((i) => i.group === group);
                  return (
                    <div key={group} className="flex flex-col gap-0.5">
                      {/* Group label */}
                      <div className="px-4 py-2 text-[0.625rem] font-bold tracking-[0.08em] text-[var(--docs-text-faint)] uppercase">
                        {group}
                      </div>

                      {/* Items */}
                      <div className="flex flex-col">
                        {groupItems.map((item) => {
                          const flatIndex = filteredItems.indexOf(item);
                          const isSelected = flatIndex === selectedIndex;
                          const IconComp = item.icon === "File" ? File : Box;

                          return (
                            <div
                              key={item.href}
                              ref={isSelected ? activeItemRef : null}
                              onClick={() => {
                                router.push(item.href);
                                setIsOpen(false);
                              }}
                              className={`h-10 px-3 flex items-center justify-between border-l-2 transition-all duration-100 cursor-pointer rounded-none ${
                                isSelected
                                  ? "border-[var(--primary)] bg-[var(--docs-elem-active)] text-[var(--docs-text-heading)] font-medium"
                                  : "border-transparent bg-transparent hover:bg-[var(--docs-elem-hover)] text-[var(--docs-text-body)] hover:text-[var(--docs-text-heading)]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <IconComp size={15} className={isSelected ? "text-[var(--primary)]" : "text-[var(--docs-text-faint)]"} />
                                <span className="text-[13px] font-sans">{item.label}</span>
                              </div>
                              <span className="text-[11px] font-mono text-[var(--docs-text-faint)]">
                                {item.path}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Panel */}
            <div className="h-9 px-4 border-t border-[var(--docs-border)] bg-white/[1%] flex items-center justify-between text-[11px] font-sans">
              <span className="text-[var(--docs-text-faint)] text-[12px]">GwenUI Docs</span>
              <div className="flex items-center gap-3 text-[var(--docs-text-dim)]">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-[var(--docs-border-faint)] font-mono text-[10px]">↑↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-[var(--docs-border-faint)] font-mono text-[10px]">↵</kbd>
                  <span>open</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-[var(--docs-border-faint)] font-mono text-[10px]">esc</kbd>
                  <span>close</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
