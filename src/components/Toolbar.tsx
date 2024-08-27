/* eslint-disable react/no-duplicate-key */
import React, { useMemo } from 'react'
import type { Editor } from '@tiptap/core'

import { Separator } from '@/components'
import { useLocale } from '@/locales'
import { isFunction } from '@/utils/utils'

export interface ToolbarProps {
  editor: Editor
  disabled?: boolean
}

interface ToolbarItemProps {
  button: {
    component: React.ComponentType<any>
    componentProps: Record<string, any>
  }
  divider: boolean
  spacer: boolean
}

function Toolbar({ editor, disabled }: ToolbarProps) {
  const { t, lang } = useLocale()

  const items = useMemo(() => {
    const extensions = [...editor.extensionManager.extensions]
    const sortExtensions = extensions.sort((arr, acc) => {
      const a = (arr.options).sort ?? -1
      const b = (acc.options).sort ?? -1
      return a - b
    })

    let menus: ToolbarItemProps[] = []

    for (const extension of sortExtensions) {
      const { button, divider = false, spacer = false, toolbar = true } = extension.options as any
      if (!button || !isFunction(button) || !toolbar) {
        continue
      }

      const _button: ToolbarItemProps['button'] | ToolbarItemProps['button'][] = button({
        editor,
        extension,
        t,
      })

      if (Array.isArray(_button)) {
        const menu: ToolbarItemProps[] = _button.map((k, i) => ({
          button: k,
          divider: i === _button.length - 1 ? divider : false,
          spacer: i === 0 ? spacer : false,
        }))
        menus = [...menus, ...menu]
        continue
      }

      menus.push({ button: _button, divider, spacer })
    }
    return menus
  }, [editor, t, lang])

  return (
    <div
      className="richtext-px-1 richtext-py-2 !richtext-border-b"
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div className="richtext-relative richtext-flex richtext-flex-wrap richtext-h-auto richtext-gap-y-1 richtext-gap-x-1">
        {items.map((item: ToolbarItemProps, key) => {
          const ButtonComponent = item.button.component

          return (
            <div className="richtext-flex richtext-items-center" key={`toolbar-item-${key}`}>
              {item?.spacer && <Separator orientation="vertical" className="!richtext-h-[16px] !richtext-mx-[10px]" />}

              <ButtonComponent
                {...item.button.componentProps}
                disabled={disabled || item?.button?.componentProps?.disabled}
              />

              {item?.divider && <Separator orientation="vertical" className="!richtext-h-auto !richtext-mx-2" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Toolbar }
