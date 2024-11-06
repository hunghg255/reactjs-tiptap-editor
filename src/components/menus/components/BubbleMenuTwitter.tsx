/* eslint-disable react/no-useless-fragment */
import { useCallback, useState } from 'react'

import type { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react'

import { Twitter } from '@/extensions'
import { ActionButton } from '@/components/ActionButton'
import { useLocale } from '@/locales'
import FormEditLinkTwitter from '@/extensions/Twitter/components/FormEditLinkTwitter'
import { deleteNode } from '@/utils/delete-node'

export interface BubbleMenuTwitterProps {
  editor: Editor
  disabled?: boolean
}

function BubbleMenuTwitter({ editor, disabled }: BubbleMenuTwitterProps) {
  const [showEdit, setShowEdit] = useState(false)
  const { t } = useLocale()

  const shouldShow = useCallback(({ editor }: { editor: Editor }) => {
    const isActive = editor.isActive(Twitter.name)
    return isActive
  }, [])

  const onSetLink = (src: string) => {
    editor.commands.updateTweet({ src })
    setShowEdit(false)
  }

  const deleteMe = useCallback(() => deleteNode(Twitter.name, editor), [editor])

  return (
    <>
      <BubbleMenu
        editor={editor}
        shouldShow={shouldShow}
        tippyOptions={{
          popperOptions: {
            modifiers: [{ name: 'flip', enabled: false }],
          },
          placement: 'bottom-start',
          offset: [-2, 16],
          zIndex: 9999,
          onHidden: () => {
            setShowEdit(false)
          },
        }}
      >
        {disabled
          ? (
              <></>
            )
          : (
              <>
                {showEdit
                  ? (
                      <FormEditLinkTwitter
                        onSetLink={onSetLink}
                        editor={editor}
                      />
                    )
                  : (
                      <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-p-2 richtext-bg-white !richtext-border richtext-rounded-lg richtext-shadow-sm dark:richtext-bg-black richtext-border-neutral-200 dark:richtext-border-neutral-800">
                        <div className="richtext-flex richtext-flex-nowrap">
                          <ActionButton
                            icon="Pencil"
                            tooltip={t('editor.link.edit.tooltip')}
                            action={() => {
                              setShowEdit(true)
                            }}
                            tooltipOptions={{ sideOffset: 15 }}
                          />
                          <ActionButton
                            icon="Trash"
                            tooltip={t('editor.delete')}
                            action={deleteMe}
                            tooltipOptions={{ sideOffset: 15 }}
                          />
                        </div>
                      </div>
                    )}
              </>
            )}
      </BubbleMenu>
    </>
  )
}

export { BubbleMenuTwitter }
