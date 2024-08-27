/* eslint-disable react/no-duplicate-key */
import React, { Fragment, useMemo } from 'react'

import {
  ActionMenuButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components'
import { useLocale } from '@/locales'
import type { ButtonViewReturnComponentProps } from '@/types'

export interface Item {
  title: string
  icon?: any
  font?: string
  isActive: NonNullable<ButtonViewReturnComponentProps['isActive']>
  action?: ButtonViewReturnComponentProps['action']
  style?: React.CSSProperties
  shortcutKeys?: string[]
  disabled?: boolean
  divider?: boolean
  default?: boolean
}

interface Props {
  editor: any
  disabled?: boolean
  color?: string
  shortcutKeys?: string[]
  maxHeight?: string | number
  tooltip?: string
  items?: Item[]
}

function FontFamilyButton(props: Props) {
  const { t, lang } = useLocale()

  const active = useMemo(() => {
    const find: any = props?.items?.find((k: any) => k.isActive())

    if (find && !find.default) {
      return {
        ...find,
      }
    }
    const item: Item = {
      title: props.tooltip as any,
      font: t('editor.fontFamily.default.tooltip'),
      isActive: () => false,
      disabled: false,
      action: () => props.editor.chain().focus().unsetFontFamily().run(),
    }
    return item
  }, [t, lang, props])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={props?.disabled} asChild>
        <ActionMenuButton
          title={active?.font?.length > 7 ? `${active?.font?.slice(0, 6)}...` : active?.font}
          tooltip={props?.tooltip}
          disabled={props?.disabled}
          icon="MenuDown"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="richtext-w-full">
        {props?.items?.map((item: any, index) => {
          const style
            = item.font === t('editor.fontFamily.default.tooltip') ? {} : { fontFamily: item.font }

          return (
            <Fragment key={`font-family-${index}`}>
              <DropdownMenuCheckboxItem checked={active?.font === item.font} onClick={item.action}>
                <div className="richtext-h-full richtext-ml-1" style={style}>
                  {item.font}
                </div>
              </DropdownMenuCheckboxItem>
              {item.font === t('editor.fontFamily.default.tooltip') && <DropdownMenuSeparator />}
            </Fragment>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FontFamilyButton
