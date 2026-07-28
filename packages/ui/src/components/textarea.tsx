import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        /* DS Textarea: 16px radius (not pill), white field, orange 3px focus ring */
        "flex field-sizing-content min-h-16 w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-fg-faint focus-visible:border-orange-500 focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
