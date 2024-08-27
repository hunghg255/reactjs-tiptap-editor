/* eslint-disable react/no-duplicate-key */
import React, { useMemo, useState } from 'react'

import {
  ActionButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  IconComponent,
} from '@/components'
import { useLocale } from '@/locales'
import type { ButtonViewReturnComponentProps } from '@/types'

interface IPropsLineHeightDropdown {
  editor: any
  icon?: any
  tooltip?: string
  disabled?: boolean
  action?: ButtonViewReturnComponentProps['action']
  isActive?: ButtonViewReturnComponentProps['isActive']
}

function percentageToDecimal(percentageString: any) {
  const percentage = Number.parseFloat(percentageString.replace('%', ''))
  const decimal = percentage / 100
  return decimal
}

function LineHeightDropdown(props: IPropsLineHeightDropdown) {
  const { t } = useLocale()
  const [value, setValue] = useState('default')

  function toggleLightheight(key: string) {
    if (key === 'default') {
      props.editor.commands.unsetLineHeight()
    }
    else {
      props.editor.commands.setLineHeight(key)
    }
    setValue(key)
  }

  const LineHeights = useMemo(() => {
    const lineHeightOptions = props.editor.extensionManager.extensions.find(
      (e: any) => e.name === 'lineHeight',
    )!.options
    const a = lineHeightOptions.lineHeights
    const b = a.map((item: any) => ({
      label: percentageToDecimal(item),
      value: item,
    }))

    b.unshift({
      label: t('editor.default'),
      value: 'default',
    })
    return b
  }, [props])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={props?.disabled} asChild>
        <ActionButton
          customClass="!richtext-w-12 richtext-h-12"
          icon="LineHeight"
          tooltip={props?.tooltip}
          disabled={props?.disabled}
        >
          <IconComponent className="richtext-w-3 richtext-h-3 richtext-ml-1 richtext-text-zinc-500" name="MenuDown" />
        </ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="richtext-min-w-24">
        {LineHeights?.map((item: any, index: any) => {
          return (
            <DropdownMenuCheckboxItem
              key={`lineHeight-${index}`}
              checked={item.value === value}
              onClick={() => toggleLightheight(item.value)}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LineHeightDropdown
