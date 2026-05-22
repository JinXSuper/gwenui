"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

type ThemeChoice = "light" | "dark" | "system"

const OPTIONS: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-[104px] rounded-lg border border-[var(--docs-border-faint)] bg-[var(--docs-elem-surface)]",
          className
        )}
        aria-hidden
      />
    )
  }

  const active = (theme ?? "system") as ThemeChoice

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        "btn-shadow-group flex items-center gap-0.5 p-0.5 h-8 rounded-lg",
        "bg-[var(--docs-elem-surface)] border border-[var(--docs-border-faint)]",
        className
      )}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
            className={cn(
              "flex items-center justify-center w-8 h-7 rounded-md transition-colors cursor-pointer border-none outline-none",
              isActive
                ? "bg-[var(--docs-text-heading)] text-[var(--background)]"
                : "bg-transparent text-[var(--docs-text-muted)] hover:text-[var(--docs-text-heading)] hover:bg-[var(--docs-elem-hover)]"
            )}
          >
            <Icon
              className={cn(
                "w-3.5 h-3.5",
                value === "light" && isActive && "--color-primary",
                value === "dark" && isActive && "--color-primary"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
