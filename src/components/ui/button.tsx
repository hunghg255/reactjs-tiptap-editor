import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'richtext-inline-flex richtext-items-center richtext-justify-center richtext-whitespace-nowrap richtext-rounded-md richtext-text-sm richtext-font-medium richtext-ring-offset-background richtext-transition-colors focus-visible:richtext-outline-none focus-visible:richtext-ring-2 focus-visible:richtext-ring-ring focus-visible:richtext-ring-offset-2 disabled:richtext-pointer-events-none disabled:richtext-opacity-50',
  {
    variants: {
      variant: {
        default: '!richtext-bg-primary !richtext-text-primary-foreground hover:!richtext-bg-primary/90',
        destructive:
          'richtext-bg-destructive richtext-text-destructive-foreground hover:richtext-bg-destructive/90',
        outline:
          'richtext-border richtext-border-input richtext-bg-background hover:richtext-bg-accent hover:richtext-text-accent-foreground',
        secondary:
          'richtext-bg-secondary richtext-text-secondary-foreground hover:richtext-bg-secondary/80',
        ghost: 'hover:richtext-bg-accent hover:richtext-text-accent-foreground',
        link: 'richtext-text-primary richtext-underline-offset-4 hover:richtext-underline',
      },
      size: {
        default: 'richtext-h-10 richtext-px-4 richtext-py-2',
        sm: 'richtext-h-9 richtext-rounded-md richtext-px-3',
        lg: 'richtext-h-11 richtext-rounded-md richtext-px-8',
        icon: 'richtext-h-10 richtext-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
