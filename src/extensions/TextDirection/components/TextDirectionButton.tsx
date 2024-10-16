/* eslint-disable react/no-duplicate-key */
import React, { useMemo } from 'react'

import { ActionButton, IconComponent } from '@/components'
import { Popover, PopoverContent, PopoverTrigger, Toggle, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui'
import type { ButtonViewReturnComponentProps } from '@/types'
import { getShortcutKey } from '@/utils/plateform'

interface IPropsTextDirectionButton {}

export interface Item {
  title: string
  icon?: any
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}
interface IPropsTextDirectionButton {
  editor: any
  disabled?: boolean
  color?: string
  maxHeight?: string | number
  icon?: any
  tooltip?: string
  items?: Item[]
}

function TextDirectionButton(props: IPropsTextDirectionButton) {
  const active = useMemo(() => {
    const find: any = props?.items?.find((k: any) => k.isActive())
    if (find && !find.default) {
      return {
        ...find,
        icon: find.icon ? find.icon : props.icon,
      }
    }
    const item: Item = {
      title: props?.tooltip as any,
      icon: props.icon,
      isActive: () => false,
    }

    return item
  }, [props])

  return (
    <Popover modal>
      <PopoverTrigger disabled={props?.disabled} asChild>
        <ActionButton
          customClass="!richtext-w-12 richtext-h-12"
          icon={props?.icon}
          tooltip={props?.tooltip}
          disabled={props?.disabled}
        >
          <IconComponent className="richtext-w-3 richtext-h-3 richtext-ml-1 richtext-text-zinc-500" name="MenuDown" />
        </ActionButton>
      </PopoverTrigger>

      <PopoverContent
        className="richtext-min-w-4 richtext-w-full !richtext-p-[4px] richtext-flex richtext-flex-row richtext-gap-1"
        align="start"
        side="bottom"
      >
        {props?.items?.map((item, index) => {
          return (
            <Tooltip key={`text-align-${index}`}>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  onClick={item?.action}
                  className="richtext-p-1 richtext-w-7 richtext-h-7"
                  pressed={active.title === item.title}
                  data-state={active.title === item.title ? 'on' : 'off'}
                >
                  {item?.icon && <IconComponent name={item.icon} />}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent className="richtext-flex richtext-flex-col richtext-items-center">
                <span>{item.title}</span>
                {!!item.shortcutKeys?.length && (
                  <span>{item.shortcutKeys?.map(item => getShortcutKey(item)).join(' ')}</span>
                )}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export default TextDirectionButton
