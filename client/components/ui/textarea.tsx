import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-stone-400 focus-visible:border-oak-400 focus-visible:ring-4 focus-visible:ring-oak-200/60 focus-visible:ring-offset-0 aria-invalid:border-destructive flex min-h-28 w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink transition-[color,box-shadow,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
