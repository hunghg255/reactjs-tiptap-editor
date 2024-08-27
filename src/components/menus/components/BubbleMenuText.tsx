/* eslint-disable react/no-duplicate-key */
import { useMemo } from 'react'

import type { Editor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { BubbleMenu } from '@tiptap/react'

import { Separator, getBubbleText } from '@/components'
import { useLocale } from '@/locales'

export interface BubbleMenuTextProps {
  editor: Editor
  disabled?: boolean
}

const tippyOptions = {
  maxWidth: 'auto',
  zIndex: 20,
  appendTo: 'parent',
  moveTransition: 'transform 0.1s ease-out',
}

function ItemA({ item, disabled, editor }: any) {
  const Comp = item.component

  if (!Comp) {
    return <></>
  }

  return (
    <Comp
      {...item.componentProps}
      editor={editor}
      disabled={disabled || item?.componentProps?.disabled}
    />
  )
}

function BubbleMenuText(props: BubbleMenuTextProps) {
  const { t, lang } = useLocale()

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state
    const { $from, to } = selection

    // check content select length is not empty
    if ($from.pos === to) {
      return false
    }

    return selection instanceof TextSelection
  }

  const items = useMemo(() => {
    if (props.disabled || !props?.editor) {
      return []
    }

    return getBubbleText(props.editor, t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang, t])

  return (
    <BubbleMenu shouldShow={shouldShow} editor={props?.editor} tippyOptions={tippyOptions as any}>
      {items?.length
        ? (
            <div className="richtext-w-auto richtext-px-3 richtext-py-2 richtext-transition-all !richtext-border richtext-rounded-sm richtext-shadow-sm richtext-pointer-events-auto richtext-select-none richtext-border-neutral-200 dark:richtext-border-neutral-800 richtext-bg-background">
              <div className="richtext-flex richtext-items-center richtext-gap-[4px] richtext-flex-nowrap richtext-whitespace-nowrap richtext-h-[26px] richtext-justify-start richtext-relative">
                {items?.map((item: any, key: any) => {
                  if (item?.type === 'divider') {
                    return (
                      <Separator
                        key={`bubbleMenu-divider-${key}`}
                        orientation="vertical"
                        className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
                      />
                    )
                  }

                  return (
                    <ItemA
                      key={`bubbleMenu-text-${key}`}
                      item={item}
                      disabled={props.disabled}
                      editor={props.editor}
                    />
                  )
                })}
              </div>
            </div>
          )
        : (
            <></>
          )}
    </BubbleMenu>
  )
}

export { BubbleMenuText }
