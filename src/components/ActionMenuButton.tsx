import React from 'react'

import { Slot } from '@radix-ui/react-slot'

import { Button, Tooltip, TooltipContent, TooltipTrigger, icons } from '@/components'
import type { ButtonViewReturnComponentProps } from '@/types'
import { getShortcutKeys } from '@/utils/plateform'

export interface ActionMenuButtonProps {
  /** Icon name to display */
  icon?: any
  /** Button title text */
  title?: string
  /** Tooltip text */
  tooltip?: string
  /** Whether the button is disabled */
  disabled?: boolean
  /** Keyboard shortcut keys */
  shortcutKeys?: string[]
  /** Button color */
  color?: string
  /** Click action handler */
  action?: ButtonViewReturnComponentProps['action']
  /** Active state checker */
  isActive?: ButtonViewReturnComponentProps['isActive']
  /** Whether to render as child */
  asChild?: boolean
}

const ActionMenuButton = React.forwardRef<HTMLButtonElement, ActionMenuButtonProps>(
  ({ asChild, ...props }, ref) => {
    const Icon = icons[props.icon]
    const Comp = asChild ? Slot : Button

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={ref}
            className="richtext-h-[32px] richtext-px-[5px] richtext-py-0 richtext-min-w-24  richtext-overflow-hidden"
            variant="ghost"
            disabled={props?.disabled}
            {...props}
          >
            <div className="richtext-flex richtext-items-center richtext-h-full richtext-font-normal">
              {props?.title && (
                <div className="richtext-flex-grow richtext-text-sm richtext-text-left richtext-truncate">{props?.title}</div>
              )}
              {Icon && <Icon className="richtext-flex-shrink-0 richtext-w-3 richtext-h-3 richtext-ml-1 richtext-text-zinc-500" />}
            </div>
          </Comp>
        </TooltipTrigger>
        <TooltipContent>
          <div className="richtext-flex richtext-flex-col richtext-items-center richtext-text-center richtext-max-w-24">
            {props?.tooltip && <div>{props?.tooltip}</div>}
            <div className="richtext-flex">
              {!!props?.shortcutKeys?.length && <span>{getShortcutKeys(props?.shortcutKeys)}</span>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  },
)

export { ActionMenuButton }
