/**
 * GwenUI Docs — Block Preview Layout
 * Author: JinXSuper
 * License: MIT
 */

import "@/app/globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { PreviewThemeShell } from "@/components/docs/PreviewThemeShell"

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-hidden antialiased bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <Suspense fallback={<div className="min-h-screen w-full bg-[var(--preview-bg)]" />}>
            <PreviewThemeShell>{children}</PreviewThemeShell>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
