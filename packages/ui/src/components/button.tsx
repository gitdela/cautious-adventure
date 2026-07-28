import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@workspace/ui/lib/utils"

/**
 * Petrosol button (DS Button): always a pill, Verdana bold, sentence-case
 * labels. Primary is the brand orange and darkens one ramp step on hover and
 * another on press; press also scales to .97. Outline inverts to solid ink on
 * hover. The orange glow (`shadow-button`) is opt-in via className — the DS
 * uses it sparingly.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:scale-[.97] disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-orange-600 active:bg-orange-700",
        station:
          "bg-leaf-500 text-white hover:bg-leaf-600 active:bg-leaf-600",
        outline:
          "border-navy-900 bg-transparent text-navy-900 hover:bg-navy-900 hover:text-white aria-expanded:bg-navy-900 aria-expanded:text-white",
        outlineInverse:
          "border-white bg-transparent text-white hover:bg-white hover:text-navy-900 aria-expanded:bg-white aria-expanded:text-navy-900",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-ink-50 aria-expanded:bg-ink-50 aria-expanded:text-secondary-foreground",
        ghost:
          "text-navy-900 hover:bg-brand/10 aria-expanded:bg-brand/10",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-orange-600 underline-offset-4 hover:text-orange-700 hover:underline",
      },
      size: {
        /* DS control scale: sm 38px/20px pad · md 46px/26px pad · lg 54px/34px pad */
        default:
          "h-[46px] gap-2.5 px-[26px] text-[15px] has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "h-7 gap-1 px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[38px] gap-2 px-5 text-[13px] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        lg: "h-[54px] gap-2.5 px-[34px] text-base has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        /* Circular icon-only controls (DS IconButton: 34 / 44 / 56) */
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-[34px]",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
