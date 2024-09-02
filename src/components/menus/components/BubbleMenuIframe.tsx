import { useCallback, useEffect, useState } from 'react'

import { BubbleMenu } from '@tiptap/react'
import { useAttributes } from '@/hooks/useAttributes'
import { ActionButton } from '@/components/ActionButton'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button, Input } from '@/components/ui'
import { SizeSetter } from '@/components/SizeSetter/SizeSetter'
import { useLocale } from '@/locales'
import type { IIframeAttrs } from '@/extensions/Iframe'
import { Iframe } from '@/extensions/Iframe'
import { deleteNode } from '@/utils/delete-node'

export function BubbleMenuIframe({ editor }: any) {
  const { t } = useLocale()
  const { width, height, url } = useAttributes<IIframeAttrs>(editor, Iframe.name, {
    width: 0,
    height: 0,
    url: '',
    defaultShowPicker: false,
  })
  const [visible, toggleVisible] = useState(false)
  const [formUrl, setFormUrl] = useState('')

  const handleCancel = useCallback(() => {
    toggleVisible(false)
  }, [toggleVisible])

  useEffect(() => {
    if (visible)
      setFormUrl(url as any)
  }, [visible, url])

  const handleOk = useCallback(() => {
    editor
      .chain()
      .updateAttributes(Iframe.name, {
        url: formUrl,
      })
      .setNodeSelection(editor.state.selection.from)
      .focus()
      .run()
    toggleVisible(false)
  }, [editor, formUrl, toggleVisible])

  const visitLink = useCallback(() => {
    window.open(url, '_blank')
  }, [url])

  const openEditLinkModal = useCallback(() => {
    toggleVisible(true)
  }, [toggleVisible])

  const setSize = useCallback(
    (size: any) => {
      editor.chain().updateAttributes(Iframe.name, size).setNodeSelection(editor.state.selection.from).focus().run()
    },
    [editor],
  )
  const shouldShow = useCallback(() => editor.isActive(Iframe.name) && !url, [editor, url])
  const deleteMe = useCallback(() => deleteNode(Iframe.name, editor), [editor])

  return (
    <>
      <BubbleMenu
        className="bubble-menu"
        editor={editor}
        pluginKey="iframe-bubble-menu"
        shouldShow={shouldShow}
        tippyOptions={{
          popperOptions: {
            modifiers: [{ name: 'flip', enabled: false }],
          },
          placement: 'bottom-start',
          offset: [-2, 16],
          zIndex: 9999,
        // onHidden: () => {
        //   toggleVisible(false)
        // },
        }}
      >

        <div className="richtext-w-auto richtext-px-3 richtext-py-2 richtext-transition-all !richtext-border richtext-rounded-sm richtext-shadow-sm richtext-pointer-events-auto richtext-select-none richtext-border-neutral-200 dark:richtext-border-neutral-800 richtext-bg-background">
          <ActionButton
            action={visitLink}
            icon="Eye"
            tooltip="Visit Link"
          />
          <ActionButton
            action={openEditLinkModal}
            icon="Pencil"
            tooltip="Open Edit Link"
          />

          <SizeSetter width={width as any} height={height as any} onOk={setSize}>
            <ActionButton
              icon="Settings"
              tooltip={t('editor.settings')}
            />
          </SizeSetter>

          <ActionButton
            action={deleteMe}
            icon="Trash2"
            tooltip={t('editor.delete')}
          />
        </div>
      </BubbleMenu>

      <Dialog
        open={visible}
        onOpenChange={toggleVisible}
      >
        <DialogTrigger />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link Iframe</DialogTitle>
          </DialogHeader>

          <Input
            value={formUrl}
            onInput={(e: any) => setFormUrl(e.target.value)}
            type="url"
            autoFocus
            placeholder="Enter link"
          />

          <DialogFooter>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleOk}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
