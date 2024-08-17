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
          <div className="flex items-center w-full p-3 my-3 transition-all border rounded-sm cursor-pointer hover:bg-accent border-border text-muted-foreground">
            {loading
              ? (
                  <div className="flex items-center justify-center gap-3 text-s">
                    <IconComponent className="w-6 h-6 animate-spin" name="LoaderCircle" />
                    <span>
                      {t('editor.video.dialog.uploading')}
                      ...
                    </span>
                  </div>
                )
              : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center gap-3">
                      <IconComponent name="Video" className="w-6 h-6" />
                      <span className="text-sm">{t('editor.video.dialog.title')}</span>
                    </div>
                    <IconComponent name="Trash2" className="hover:text-foreground" onClick={handleDelete} />
                  </div>
                )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full" onOpenAutoFocus={e => e.preventDefault()}>
          <Tabs defaultValue="upload" className="w-[400px]" activationMode="manual">
            <TabsList className="grid w-full grid-cols-2">
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
              <Button className="w-full mt-1" size="sm" onClick={handleClick}>
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
                <div className="flex items-center gap-2">
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
