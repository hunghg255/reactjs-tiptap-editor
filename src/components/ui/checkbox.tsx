'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      '!richtext-peer !richtext-h-4 !richtext-w-4 !richtext-shrink-0 !richtext-rounded-sm !richtext-border !richtext-border-primary !richtext-p-0 !richtext-ring-offset-background focus-visible:!richtext-outline-none focus-visible:!richtext-ring-2 focus-visible:!richtext-ring-ring focus-visible:!richtext-ring-offset-1 disabled:!richtext-cursor-not-allowed disabled:!richtext-opacity-50 data-[state=checked]:!richtext-bg-primary data-[state=checked]:!richtext-text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        '!richtext-flex !richtext-items-center !richtext-justify-center !richtext-p-0 !richtext-text-current'
      )}
    >
      <Check className='!richtext-h-4 !richtext-w-4' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
