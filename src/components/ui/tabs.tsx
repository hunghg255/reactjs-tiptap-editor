'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'richtext-inline-flex richtext-h-10 richtext-items-center richtext-justify-center richtext-rounded-md richtext-bg-muted richtext-p-1 richtext-text-muted-foreground',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'richtext-inline-flex richtext-items-center richtext-justify-center richtext-whitespace-nowrap richtext-rounded-sm richtext-px-3 richtext-py-1.5 richtext-text-sm richtext-font-medium richtext-ring-offset-background richtext-transition-all focus-visible:richtext-outline-none focus-visible:richtext-ring-2 focus-visible:richtext-ring-ring focus-visible:richtext-ring-offset-2 disabled:richtext-pointer-events-none disabled:richtext-opacity-50 data-[state=active]:richtext-bg-background data-[state=active]:richtext-text-foreground data-[state=active]:richtext-shadow-sm',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'richtext-mt-2 richtext-ring-offset-background focus-visible:richtext-outline-none focus-visible:richtext-ring-2 focus-visible:richtext-ring-ring focus-visible:richtext-ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
