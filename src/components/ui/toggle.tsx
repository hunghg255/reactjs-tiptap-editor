'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  'richtext-inline-flex richtext-items-center richtext-justify-center richtext-rounded-md richtext-text-sm richtext-font-medium richtext-ring-offset-background richtext-transition-colors hover:richtext-bg-muted hover:richtext-text-muted-foreground focus-visible:richtext-outline-none focus-visible:richtext-ring-2 focus-visible:richtext-ring-ring focus-visible:richtext-ring-offset-2 disabled:richtext-pointer-events-none disabled:richtext-opacity-50 data-[state=on]:richtext-bg-accent data-[state=on]:richtext-text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'richtext-bg-transparent',
        outline:
          'richtext-border richtext-border-input richtext-bg-transparent hover:richtext-bg-accent hover:richtext-text-accent-foreground',
      },
      size: {
        default: 'richtext-h-10 richtext-px-3',
        sm: 'richtext-h-9 richtext-px-2',
        lg: 'richtext-h-11 richtext-px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
