/* eslint-disable react/no-duplicate-key */
import React, { useMemo } from 'react'

import {
  ActionMenuButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components'
import { useLocale } from '@/locales'
import type { ButtonViewReturnComponentProps } from '@/types'

export interface Item {
  title: string
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  disabled?: boolean
  divider?: boolean
  default?: boolean
}

interface IPropsFontSizeMenuButton {
  editor: any
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  items?: Item[]
}

function FontSizeMenuButton(props: IPropsFontSizeMenuButton) {
  const { t } = useLocale()

  const active = useMemo(() => {
    const find: any = (props.items || []).find((k: any) => k.isActive())
    if (find) {
      return find
    }
    const item: Item = {
      title: t('editor.fontSize.default.tooltip'),
      isActive: () => false,
    }
    return item
  }, [props])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={props?.disabled} asChild>
        <ActionMenuButton
          title={active?.title}
          tooltip={`${props?.tooltip}`}
          disabled={props?.disabled}
          icon="MenuDown"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="richtext-w-32 richtext-overflow-y-auto richtext-max-h-96">
        {props?.items?.map((item: any, index) => {
          return (
            <DropdownMenuCheckboxItem
              key={`font-size-${index}`}
              checked={active.title === item.title}
              onClick={item.action}
            >
              <div className="richtext-h-full richtext-ml-1">{item.title}</div>
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FontSizeMenuButton
