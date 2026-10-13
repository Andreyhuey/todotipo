import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-oak-400 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: 'bg-forest-800 text-linen shadow-xs hover:bg-forest-700',
        oak: 'bg-oak-500 text-white shadow-xs hover:bg-oak-600',
        light: 'bg-linen text-ink hover:bg-white',
        outline: 'border border-stone-300 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-linen',
        outlineLight: 'border border-linen/40 bg-transparent text-linen hover:bg-linen hover:text-ink',
        secondary: 'bg-linen-300 text-ink hover:bg-linen-400',
        ghost: 'text-ink hover:bg-linen-300',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        link: 'text-ink underline-offset-4 hover:underline rounded-none px-0',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-[13px]',
        lg: 'h-[52px] px-8 text-[15px]',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
