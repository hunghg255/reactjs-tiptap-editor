/* eslint-disable ts/no-unused-expressions */
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Bike, Clock3, Cloudy, Component, FolderDot, Laugh, Pointer } from 'lucide-react'
import { ACTIVITIES, EXPRESSIONES, GESTURES, OBJECTS, SKY_WEATHER, SYMBOLS } from './constants'
import { createKeysLocalStorageLRUCache } from '@/utils/lru-cache'
import { ActionButton, Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import { useLocale } from '@/locales'

const emojiLocalStorageLRUCache = createKeysLocalStorageLRUCache('EMOJI_PICKER', 20)

const LIST = [
  {
    title: 'Expression',
    data: EXPRESSIONES,
    icon: Laugh,
  },
  {
    title: 'Weather',
    data: SKY_WEATHER,
    icon: Cloudy,
  },
  {
    title: 'Gesture',
    data: GESTURES,
    icon: Pointer,
  },
  {
    title: 'Symbol',
    data: SYMBOLS,
    icon: Component,
  },
  {
    title: 'Object',
    data: OBJECTS,
    icon: FolderDot,
  },
  {
    title: 'Activity',
    data: ACTIVITIES,
    icon: Bike,
  },
]

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
      ? [{ title: 'Recently Used', icon: Clock3, data: recentUsed }, ...LIST]
      : LIST),
    [recentUsed],
  )

  const selectEmoji = useCallback(
    (emoji: any) => {
      emojiLocalStorageLRUCache.put(emoji)
      // @ts-ignore
      setRecentUsed(emojiLocalStorageLRUCache.get() as string[])
      onSelectEmoji && onSelectEmoji(emoji)
    },
    [onSelectEmoji],
  )

  useEffect(() => {
    emojiLocalStorageLRUCache.syncFromStorage()
    // @ts-expect-error
    setRecentUsed(emojiLocalStorageLRUCache.get() as string[])
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent hideWhenDetached className="w-full h-full p-2" align="start" side="bottom">
        <Tabs defaultValue="Recently Used">
          <TabsList className="flex items-center gap-[6px]">
            {renderedList.map((list) => {
              return (
                <TabsTrigger
                  key={list.title}
                  value={list.title}
                >
                  {list.icon && <list.icon size={16} />}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {renderedList.map((list) => {
            return (
              <TabsContent
                key={list.title}
                value={list.title}
              >
                <p className="mb-[6px] font-semibold">{t(list.title as any)}</p>
                <div className="grid grid-cols-8 gap-1 ">
                  {(list.data || []).map(ex => (
                    <div
                      key={ex}
                      onClick={() => selectEmoji(ex)}
                      className="text-center cursor-pointer"
                    >
                      {ex}
                    </div>
                  ))}
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
