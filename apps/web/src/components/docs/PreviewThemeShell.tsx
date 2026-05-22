"use client"

import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

export function PreviewThemeShell({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const { setTheme } = useTheme()
  const themeParam = searchParams.get("theme")

  useEffect(() => {
    if (themeParam === "light" || themeParam === "dark") {
      setTheme(themeParam)
    }
  }, [themeParam, setTheme])

  return (
    <div className={cn("min-h-screen w-full flex items-center justify-center bg-[var(--preview-bg)]")}>
      {children}
    </div>
  )
}
