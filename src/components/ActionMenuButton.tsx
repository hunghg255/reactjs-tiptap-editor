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
            className="h-[32px] px-[5px] py-0 min-w-24 max-w-32 overflow-hidden"
            variant="ghost"
            disabled={props?.disabled}
            {...props}
          >
            <div className="flex items-center h-full font-normal">
              {props?.title && (
                <div className="flex-grow text-sm text-left truncate">{props?.title}</div>
              )}
              {Icon && <Icon className="flex-shrink-0 w-3 h-3 ml-1 text-zinc-500" />}
            </div>
          </Comp>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col items-center text-center max-w-24">
            {props?.tooltip && <div>{props?.tooltip}</div>}
            <div className="flex">
              {!!props?.shortcutKeys?.length && <span>{getShortcutKeys(props?.shortcutKeys)}</span>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    )
  },
)

export { ActionMenuButton }
