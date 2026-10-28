import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

// CodeWithT chips: radius-lg, 12px medium labels
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium leading-4 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-brand-400/30 bg-brand-400/5 text-primary",
        secondary: "border-border bg-card text-faint",
        destructive: "border-destructive/30 bg-destructive/5 text-destructive",
        absent: "border-absent-solid/30 bg-absent-tint text-absent",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
