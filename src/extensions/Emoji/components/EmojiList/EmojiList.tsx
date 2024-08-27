/* eslint-disable react/no-duplicate-key */
/* eslint-disable ts/no-unused-expressions */
import clsx from 'clsx'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import scrollIntoView from 'scroll-into-view-if-needed'
import { useLocale } from '@/locales'

interface IProps {
  items: Array<{ name: string, emoji: string, fallbackImage?: string }>
  command: any
}

export const EmojiList: React.FC<IProps> = forwardRef((props, ref) => {
  const $container: any = useRef<HTMLDivElement>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { t } = useLocale()

  const selectItem = (index: any) => {
    const item = props.items[index]

    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useEffect(() => {
    if (Number.isNaN(selectedIndex + 1))
      return
    const el = $container.current.querySelector(`span:nth-of-type(${selectedIndex + 1})`)
    el && scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' })
  }, [selectedIndex])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="richtext-w-[200px] richtext-max-h-[320px] richtext-overflow-x-hidden richtext-overflow-y-auto richtext-rounded-sm !richtext-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
      <div ref={$container}>
        {props.items.length
          ? (
              props.items.map((item, index) => (
                <span
                  className={clsx(' richtext-flex richtext-relative  richtext-cursor-default richtext-select-none richtext-items-center richtext-rounded-sm richtext-px-2 richtext-py-1.5 richtext-text-sm richtext-outline-none richtext-transition-colors focus:richtext-bg-accent focus:richtext-text-accent-foreground  hover:richtext-bg-accent', index === selectedIndex ? 'bg-accent' : '')}
                  key={`emoji-list-code-${index}`}
                  onClick={() => selectItem(index)}
                >
                  {item.fallbackImage ? <img src={item.fallbackImage} className="richtext-w-[1em] richtext-h-[1em]" /> : item.emoji}
                  :
                  {item.name}
                  :
                </span>
              ))
            )
          : (
              <div className="richtext-flex richtext-relative  richtext-cursor-default richtext-select-none richtext-items-center richtext-rounded-sm richtext-px-2 richtext-py-1.5 richtext-text-sm richtext-outline-none richtext-transition-colors">
                <span>{t('no_result_found')}</span>
              </div>
            )}
      </div>
    </div>
  )
})

EmojiList.displayName = 'EmojiList'
