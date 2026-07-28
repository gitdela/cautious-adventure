import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@workspace/ui/lib/utils"

/**
 * Petrosol badge (DS Badge): pill, tinted fill + matching ink, uppercase-ready.
 * DS tones map: default→orange tint · brand→solid orange · secondary→neutral
 * tint · dark→ink-1000 · success/destructive/info→status tints.
 */
const badgeVariants = cva(
  "group/badge inline-flex h-7 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-4xl border border-transparent px-3.5 py-0.5 text-[11px] font-bold tracking-[0.06em] whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-orange-50 text-orange-700 [a]:hover:bg-orange-100",
        brand: "bg-brand text-brand-foreground [a]:hover:bg-orange-600",
        secondary:
          "bg-ink-100 text-ink-700 [a]:hover:bg-ink-150",
        dark: "bg-ink-1000 text-white",
        success: "bg-[color:var(--success-bg)] text-[color:var(--success)]",
        info: "bg-[color:var(--info-bg)] text-[color:var(--info)]",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-navy-900 [a]:hover:bg-muted",
        ghost:
          "hover:bg-muted hover:text-muted-foreground",
        link: "text-orange-600 underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
