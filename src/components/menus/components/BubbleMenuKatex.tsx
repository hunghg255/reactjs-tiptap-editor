import { BubbleMenu } from '@tiptap/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { HelpCircle, Pencil, Trash2 } from 'lucide-react'
import { Katex } from '@/extensions'
import { deleteNode } from '@/utils/delete-node'
import { useAttributes } from '@/hooks/useAttributes'
import type { IKatexAttrs } from '@/extensions/Katex'
import { Textarea } from '@/components/ui/textarea'
import { ActionButton } from '@/components/ActionButton'
import { Button } from '@/components/ui'

function BubbleMenuKatex({ editor, ...props }: any) {
  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    defaultShowPicker: false,
  })
  const { text, defaultShowPicker } = attrs
  const ref: any = useRef<HTMLTextAreaElement>()
  const [visible, toggleVisible] = useState(false)

  const shouldShow = useCallback(() => editor.isActive(Katex.name), [editor])

  const deleteMe = useCallback(() => deleteNode(Katex.name, editor), [editor])

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: ref.current.value }).run()
  }, [editor])

  useEffect(() => {
    if (defaultShowPicker) {
      toggleVisible(true)
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run()
    }
  }, [editor, defaultShowPicker, toggleVisible])

  useEffect(() => {
    if (visible) {
      setTimeout(() => ref.current?.focus(), 200)
    }
  }, [visible])

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="Katex-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        placement: 'bottom-start',
        offset: [-2, 16],
        zIndex: 9999,
        onHidden: () => {
          toggleVisible(false)
        },
      }}
    >
      {props?.disabled
        ? (
            <></>
          )
        : (
            <div className="richtext-p-2 richtext-bg-white richtext-border richtext-rounded-lg richtext-shadow-sm dark:richtext-bg-black richtext-border-neutral-200 dark:richtext-border-neutral-800">
              {visible
                ? (
                    <>
                      <Textarea
                        ref={ref}
                        autoFocus
                        placeholder="Formula text"
                        rows={3}
                        defaultValue={text}
                        style={{ marginBottom: 8 }}
                      />
                      <div className="richtext-flex richtext-items-center richtext-justify-between richtext-gap-[6px]">
                        <Button onClick={submit} className="richtext-flex-1">Submit</Button>

                        <a href="https://katex.org/" target="_blank" rel="noreferrer noopener">
                          <HelpCircle size={16} />
                        </a>
                      </div>
                    </>
                  )
                : (
                    <div className="richtext-flex richtext-items-center richtext-justify-center richtext-gap-[6px]">
                      <ActionButton tooltip="Edit" action={() => toggleVisible(!visible)}>
                        <Pencil size={16} />
                      </ActionButton>

                      <ActionButton tooltip="Delete" action={deleteMe}>
                        <Trash2 size={16} />
                      </ActionButton>
                    </div>
                  )}
            </div>
          )}

    </BubbleMenu>
  )
}

export default BubbleMenuKatex
