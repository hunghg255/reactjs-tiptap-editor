import React, { useRef, useState } from 'react'

import type { Editor } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'

import { IconComponent } from '@/components/icons'
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { useLocale } from '@/locales'

interface IPropsVideoUploaderView {
  editor: Editor
  getPos: () => number
  deleteNode: () => void
}

function VideoUploaderView(props: IPropsVideoUploaderView) {
  const { t } = useLocale()
  const { editor, getPos, deleteNode } = props

  const [link, setLink] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const fileInput = useRef<HTMLInputElement>(null)

  function handleFile(event: any) {
    setLoading(true)
    const files = event?.target?.files
    if (!editor || editor.isDestroyed || files.length === 0) {
      return
    }
    const file = files[0]
    const uploadOptions = editor.extensionManager.extensions.find(
      (extension: any) => extension.name === 'videoUpload',
    )?.options
    uploadOptions?.upload([file]).then((res: any) => {
      editor
        .chain()
        .setVideo({ src: res[0].src, width: '100%' })
        .deleteRange({ from: getPos(), to: getPos() })
        .focus()
        .run()
      setLoading(false)
    })
  }
  function handleLink(e: any) {
    e.preventDefault()

    editor
      .chain()
      .setVideo({
        src: link,
        width: '100%',
      })
      .deleteRange({ from: getPos(), to: getPos() })
      .focus()
      .run()
  }
  function handleDelete(e: any) {
    e.preventDefault()
    deleteNode()
  }
  function handleClick(e: any) {
    e.preventDefault()
    fileInput.current?.click()
  }

  return (
    <NodeViewWrapper as="div" data-drag-handle>
      <Popover defaultOpen modal>
        <PopoverTrigger asChild>
          <div className="richtext-flex richtext-items-center richtext-w-full richtext-p-3 richtext-my-3 richtext-transition-all !richtext-border richtext-rounded-sm richtext-cursor-pointer hover:richtext-bg-accent richtext-border-border richtext-text-muted-foreground">
            {loading
              ? (
                  <div className="richtext-flex richtext-items-center richtext-justify-center richtext-gap-3 richtext-text-sm">
                    <IconComponent className="richtext-w-6 richtext-h-6 richtext-animate-spin" name="LoaderCircle" />
                    <span>
                      {t('editor.video.dialog.uploading')}
                      ...
                    </span>
                  </div>
                )
              : (
                  <div className="richtext-flex richtext-items-center richtext-justify-between richtext-w-full">
                    <div className="richtext-flex richtext-items-center richtext-justify-center richtext-gap-3">
                      <IconComponent name="Video" className="richtext-w-6 richtext-h-6" />
                      <span className="richtext-text-sm">{t('editor.video.dialog.title')}</span>
                    </div>
                    <IconComponent name="Trash2" className="hover:richtext-text-foreground" onClick={handleDelete} />
                  </div>
                )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="richtext-w-full" onOpenAutoFocus={e => e.preventDefault()}>
          <Tabs defaultValue="upload" className="richtext-w-[400px]" activationMode="manual">
            <TabsList className="richtext-grid richtext-w-full richtext-grid-cols-2">
              <TabsTrigger value="upload">
                {t('editor.video.dialog.tab.upload')}
                {' '}
              </TabsTrigger>
              <TabsTrigger value="link">
                {' '}
                {t('editor.video.dialog.link')}
                {' '}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <Button className="richtext-w-full richtext-mt-1" size="sm" onClick={handleClick}>
                {t('editor.video.dialog.tab.upload')}
              </Button>
              <input
                type="file"
                accept="video/*"
                ref={fileInput}
                multiple
                style={{
                  display: 'none',
                }}
                onChange={handleFile}
              />
            </TabsContent>
            <TabsContent value="link">
              <form onSubmit={handleLink}>
                <div className="richtext-flex richtext-items-center richtext-gap-2">
                  <Input
                    type="url"
                    autoFocus={true}
                    required
                    placeholder={t('editor.video.dialog.placeholder')}
                    value={link}
                    onChange={e => setLink(e.target.value)}
                  />
                  <Button type="submit">{t('editor.video.dialog.button.apply')}</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  )
}

export default VideoUploaderView
