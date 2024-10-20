/* eslint-disable react/no-useless-fragment */
import { Fragment, useMemo } from 'react'

import type { Editor } from '@tiptap/react'
import { BubbleMenu as BubbleMenuReact } from '@tiptap/react'

import { Separator, getBubbleMermaid } from '@/components'
import { useLocale } from '@/locales'
import { EditMermaidBlock } from '@/extensions/Mermaid/components/EditMermaidBlock'
import { useAttributes } from '@/hooks/useAttributes'
import { Mermaid } from '@/extensions'
import { useExtension } from '@/hooks/useExtension'

interface IPropsBubbleMenu {
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
    <Fragment>
      {item.type === 'divider'
        ? (
            <Separator orientation="vertical" className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]" />
          )
        : (
            <Comp
              {...item.componentProps}
              editor={editor}
              disabled={disabled || item?.componentProps?.disabled}
            />
          )}
    </Fragment>
  )
}

function isMermaidNode(node: any) {
  return node.type.name === 'mermaid'
}

function BubbleMenuMermaid(props: IPropsBubbleMenu) {
  const { lang } = useLocale()

  const attrs = useAttributes<any>(props.editor, Mermaid.name)

  const extension = useExtension(props.editor, Mermaid.name)

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state
    const { $from, to } = selection
    let isMermaid = false

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (isMermaidNode(node)) {
        isMermaid = true
        return false // Stop iteration if an mermaid is found
      }
    })

    return isMermaid
  }

  const items = useMemo(() => {
    if (props.disabled) {
      return []
    }
    return getBubbleMermaid(props.editor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang])

  return (
    <>
      <BubbleMenuReact
        shouldShow={shouldShow}
        editor={props?.editor}
        tippyOptions={tippyOptions as any}
      >
        {items?.length
          ? (
              <div className="richtext-w-auto richtext-px-3 richtext-py-2 richtext-transition-all !richtext-border richtext-rounded-sm richtext-shadow-sm richtext-pointer-events-auto richtext-select-none richtext-border-neutral-200 dark:richtext-border-neutral-800 richtext-bg-background">
                <div className="richtext-flex richtext-items-center richtext-flex-nowrap richtext-whitespace-nowrap richtext-h-[26px] richtext-justify-start richtext-relative">
                  {items?.map((item: any, key: any) => {
                    if (item.type === 'edit' && attrs?.src) {
                      return (
                        <EditMermaidBlock
                          key={`bubbleMenu-mermaid-${key}`}
                          editor={props.editor}
                          attrs={attrs}
                          extension={extension}
                        />
                      )
                    }

                    return (
                      <ItemA
                        key={`bubbleMenu-mermaid-${key}`}
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
      </BubbleMenuReact>
    </>
  )
}

export { BubbleMenuMermaid }
