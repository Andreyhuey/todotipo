import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-stone-400 selection:bg-oak-200 border-input flex h-12 w-full min-w-0 rounded-xl border bg-white px-4 py-2 text-[15px] text-ink transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-linen disabled:opacity-70",
        "focus-visible:border-oak-400 focus-visible:ring-4 focus-visible:ring-oak-200/60 focus-visible:ring-offset-0",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
