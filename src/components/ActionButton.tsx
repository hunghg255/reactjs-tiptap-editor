/* eslint-disable react/no-unstable-default-props */
/* eslint-disable unused-imports/no-unused-vars */
import React from 'react'

import { Slot } from '@radix-ui/react-slot'
import type { TooltipContentProps } from '@radix-ui/react-tooltip'

import { Toggle, Tooltip, TooltipContent, TooltipTrigger, icons } from '@/components'
import type { ButtonViewReturnComponentProps } from '@/types'
import { getShortcutKeys } from '@/utils/plateform'

export interface ActionButtonProps {
  /* Icon name to display */
  icon?: string
  /* Button title */
  title?: string
  /* Tooltip text */
  tooltip?: string
  /* Whether the button is disabled */
  disabled?: boolean
  /* Keyboard shortcut keys */
  shortcutKeys?: string[]
  /* Custom CSS class */
  customClass?: string
  /* Loading state */
  loading?: boolean
  /* Tooltip options */
  tooltipOptions?: TooltipContentProps
  /* Button color */
  color?: string
  /* Click action handler */
  action?: ButtonViewReturnComponentProps['action']
  /* Active state checker */
  isActive?: ButtonViewReturnComponentProps['isActive']
  /* Child components */
  children?: React.ReactNode
  /* Whether to render as child */
  asChild?: boolean
  /* Whether it's an upload button */
  upload?: boolean
}

const ActionButton = React.forwardRef<HTMLButtonElement, Partial<ActionButtonProps>>(
  (props, ref) => {
    const {
      icon = undefined,
      // title = undefined,
      tooltip = undefined,
      disabled = false,
      customClass = '',
      // color = undefined,
      // loading = false,
      shortcutKeys = undefined,
      tooltipOptions = {},
      action = undefined,
      isActive = undefined,
      children,
      asChild = false,
      upload = false,
      ...rest
    } = props

    const Icon = icons[icon as string]
    const Comp = asChild ? Slot : Toggle

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={ref}
            size="sm"
            className={`w-[32px] h-[32px] ${customClass}`}
            // pressed={isActive?.() || false}
            disabled={disabled}
            onClick={action}
            data-state={isActive?.() ? 'on' : 'off'}
            {...rest}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {children}
          </Comp>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent {...tooltipOptions}>
            <div className="flex flex-col items-center text-center max-w-24">
              <div>{tooltip}</div>
              {!!shortcutKeys?.length && <span>{getShortcutKeys(shortcutKeys)}</span>}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    )
  },
)

export {
  ActionButton,
}
