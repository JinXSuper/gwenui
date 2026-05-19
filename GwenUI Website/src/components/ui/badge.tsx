import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative overflow-hidden select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{
        boxShadow: "var(--shadow-tier-1)",
        border: "var(--border-dashed)",
      }}
      {...props}
    >
      {/* Lightning top-edge shine (Tier 1: lightning-sm) */}
      <span 
        className="absolute top-0 left-[20%] right-[20%] h-[1px] pointer-events-none z-[1]"
        style={{ background: "var(--lightning-sm)" }}
      />
      {props.children}
    </div>
  )
}

export { Badge, badgeVariants }
