"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <>
      {/* Self-contained styling for Sonner to guarantee custom border-dashed, shadow-tier-4, and primary-tint lightning line */}
      <style>{`
        .group.toaster .toast {
          position: relative !important;
          overflow: hidden !important;
          box-shadow: var(--shadow-tier-4) !important;
          border: var(--border-dashed) !important;
          background: var(--surface) !important;
          color: white !important;
          border-radius: 12px !important;
        }
        
        /* Lightning top-edge shine (Tier 4: lightning-md) */
        .group.toaster .toast::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 20% !important;
          right: 20% !important;
          height: 1px !important;
          background: var(--lightning-md) !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }
      `}</style>
      
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        toastOptions={{
          classNames: {
            toast: "toast",
            description: "text-muted-foreground text-xs",
            actionButton: "bg-primary text-primary-foreground",
            cancelButton: "bg-muted text-muted-foreground",
          },
        }}
        {...props}
      />
    </>
  )
}

export { Toaster }
