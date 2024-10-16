/* eslint-disable react/no-duplicate-key */
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Clock3, Laugh } from 'lucide-react'
import { ACTIVITIES, ANIMALS, EXPRESSIONES, FLAGS, FOODS, OBJECTS, SYMBOLS, TRAVELS } from './constants'
import { ActionButton, Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import Activity from '@/components/icons/Activity'
import Animal from '@/components/icons/Animas'
import Flag from '@/components/icons/Flag'
import Food from '@/components/icons/Food'
import Object from '@/components/icons/Object'
import Symbol from '@/components/icons/Symbol'
import Travel from '@/components/icons/Travel'
import { useLocale } from '@/locales'
import { createKeysLocalStorageLRUCache } from '@/utils/lru-cache'

const emojiLocalStorageLRUCache = createKeysLocalStorageLRUCache('EMOJI_PICKER', 20)

const LIST = [
  {
    title: 'Smileys & People',
    data: EXPRESSIONES,
    icon: Laugh,
  },
  {
    title: 'Animals & Nature',
    data: ANIMALS,
    icon: Animal,
  },
  {
    title: 'Food & Drink',
    data: FOODS,
    icon: Food,
  },
  {
    title: 'Activity',
    data: ACTIVITIES,
    icon: Activity,
  },
  {
    title: 'Travel & Places',
    data: TRAVELS,
    icon: Travel,
  },
  {
    title: 'Object',
    data: OBJECTS,
    icon: Object,
  },
  {
    title: 'Symbol',
    data: SYMBOLS,
    icon: Symbol,
  },
  {
    title: 'Flags',
    data: FLAGS,
    icon: Flag,
  },
]

const RECENT_DEFAULT = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣']

interface IProps {
  showClear?: boolean
  onSelectEmoji: (arg: string) => void
  children: React.ReactNode
}

function EmojiPickerWrap({ onSelectEmoji, children }: IProps) {
  const [recentUsed, setRecentUsed] = useState([])
  const { t } = useLocale()

  const renderedList = useMemo(
    () => (recentUsed.length
      ? [{ title: 'Frequently used', icon: Clock3, data: recentUsed }, ...LIST]
      : LIST),
    [recentUsed],
  )

  const selectEmoji = useCallback(
    (emoji: any) => {
      emojiLocalStorageLRUCache.put(emoji)
      // @ts-expect-error
      setRecentUsed(emojiLocalStorageLRUCache.get() as string[])

      if (onSelectEmoji)
        onSelectEmoji(emoji)
    },
    [onSelectEmoji],
  )

  useEffect(() => {
    emojiLocalStorageLRUCache.syncFromStorage()
    const defaultEmoji = emojiLocalStorageLRUCache.get() as string[]

    if (!defaultEmoji?.length) {
      RECENT_DEFAULT.forEach((emoji) => {
        emojiLocalStorageLRUCache.put(emoji)
      })
    }

    const defaultEmojiNew = emojiLocalStorageLRUCache.get() as string[]
    setRecentUsed(defaultEmojiNew as any)
  }, [])

  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent hideWhenDetached className="richtext-w-full richtext-h-full richtext-p-2" align="start" side="bottom">
        <Tabs defaultValue="Frequently used">
          <TabsList className="richtext-flex richtext-items-center richtext-gap-[4px]">
            {renderedList.map((list) => {
              return (
                <TabsTrigger
                  key={`emoji-picker-title-${list.title}`}
                  value={list.title}
                  className="!richtext-p-[6px] richtext-bg-accent hover:richtext-text-accent-foreground"
                >
                  {list.icon && <list.icon size={16} />}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {renderedList.map((list) => {
            return (
              <TabsContent
                key={`emoji-picker-content-${list.title}`}
                value={list.title}
              >
                <p className="richtext-mb-[6px] richtext-font-semibold">{t(list.title as any)}</p>
                <div className="richtext-max-h-[280px] richtext-overflow-y-auto">
                  <div className="richtext-grid richtext-grid-cols-8 richtext-gap-1 ">
                    {(list.data || []).map(ex => (
                      <div
                        key={`emoji-picker-${ex}`}
                        onClick={() => selectEmoji(ex)}
                        className="richtext-text-center richtext-cursor-pointer"
                      >
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

export function EmojiPicker({ editor, icon, ...props }: any) {
  const setEmoji = useCallback(
    (emoji: any) => {
      const { selection } = editor.state
      const { $anchor } = selection
      return editor.chain().insertContentAt($anchor.pos, emoji).run()
    },
    [editor],
  )

  return (
    <EmojiPickerWrap onSelectEmoji={setEmoji}>
      <ActionButton
        tooltip={props?.tooltip}
        icon={icon}
      />
    </EmojiPickerWrap>
  )
}

export default EmojiPicker
