import { useMemo } from 'react'

import type { Editor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { BubbleMenu } from '@tiptap/react'

import { Separator, getBubbleText } from '@/components'
import { useLocale } from '@/locales'

interface IPropsBubbleMenuText {
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

function BubbleMenuText(props: IPropsBubbleMenuText) {
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
            <div className="w-auto px-3 py-2 transition-all border rounded-sm shadow-sm pointer-events-auto select-none border-neutral-200 dark:border-neutral-800 bg-background">
              <div className="flex items-center gap-[4px] flex-nowrap whitespace-nowrap h-[26px] justify-start relative">
                {items?.map((item: any, key: any) => {
                  if (item?.type === 'divider') {
                    return (
                      <Separator
                        key={`bubbleMenu-divider-${key}`}
                        orientation="vertical"
                        className="mx-1 me-2 h-[16px]"
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
