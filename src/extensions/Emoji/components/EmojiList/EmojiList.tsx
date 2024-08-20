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
    <div className="w-[200px] max-h-[320px] overflow-x-hidden overflow-y-auto rounded-sm border bg-popover p-1 text-popover-foreground shadow-md outline-none">
      <div ref={$container}>
        {props.items.length
          ? (
              props.items.map((item, index) => (
                <span
                  className={clsx(' flex relative  cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground  hover:bg-accent', index === selectedIndex ? 'bg-accent' : '')}
                  key={index}
                  onClick={() => selectItem(index)}
                >
                  {item.fallbackImage ? <img src={item.fallbackImage} className="w-[1em] h-[1em]" /> : item.emoji}
                  :
                  {item.name}
                  :
                </span>
              ))
            )
          : (
              <div className="flex relative  cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors">
                <span>{t('no_result_found')}</span>
              </div>
            )}
      </div>
    </div>
  )
})

EmojiList.displayName = 'EmojiList'
