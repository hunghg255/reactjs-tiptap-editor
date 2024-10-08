import React, { useRef, useState } from 'react'

import { NodeViewWrapper } from '@tiptap/react'

import { Button, IconComponent, Input, Popover, PopoverContent, PopoverTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import { useLocale } from '@/locales'
import { createImageUpload } from '@/plugins/image-upload'

function ImageUploader(props: any) {
  const { t } = useLocale()

  const [link, setLink] = useState<string>('')
  const fileInput = useRef<HTMLInputElement>(null)

  function handleFile(event: any) {
    const files = event?.target?.files
    if (!props.editor || props.editor.isDestroyed || files.length === 0) {
      return
    }
    const file = files[0]
    const uploadOptions = props.editor.extensionManager.extensions.find(
      (extension: any) => extension.name === 'imageUpload',
    )?.options

    const uploadFn = createImageUpload({
      validateFn: () => {
        return true
      },
      onUpload: uploadOptions.upload,
      postUpload: uploadOptions.postUpload,
    })
    uploadFn([file], props.editor.view, props.getPos())
  }
  function handleLink(e: any) {
    e.preventDefault()

    props.editor
      .chain()
      .setImage({ src: link })
      .deleteRange({ from: props.getPos(), to: props.getPos() })
      .focus()
      .run()
  }
  function handleDelete(e?: any) {
    e?.preventDefault()
    props.deleteNode()
  }
  function handleClick(e: any) {
    e.preventDefault()
    fileInput.current?.click()
  }

  return (
    <NodeViewWrapper className="richtext-p-0 richtext-m-0" data-drag-handle>
      <Popover defaultOpen modal>
        <PopoverTrigger asChild>
          <div className="richtext-flex richtext-items-center richtext-w-full richtext-p-3 richtext-my-3 richtext-transition-all !richtext-border richtext-rounded-sm richtext-cursor-pointer hover:richtext-bg-accent richtext-border-border richtext-text-muted-foreground">
            <div className="richtext-flex richtext-items-center richtext-justify-between richtext-w-full">
              <div className="richtext-flex richtext-items-center richtext-justify-center richtext-gap-3">
                <IconComponent name="ImageUp" className="richtext-w-6 richtext-h-6" />
                <span className="richtext-text-sm">{t('editor.image.dialog.title')}</span>
              </div>
              <IconComponent name="Trash2" className="hover:richtext-text-foreground" onClick={handleDelete} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="richtext-w-full" onOpenAutoFocus={e => e.preventDefault()}>
          <Tabs defaultValue="upload" className="richtext-w-[400px]" activationMode="manual">
            <TabsList className="richtext-grid richtext-w-full richtext-grid-cols-2">
              <TabsTrigger value="upload">
                {t('editor.image.dialog.tab.upload')}
                {' '}
              </TabsTrigger>
              <TabsTrigger value="link">
                {' '}
                {t('editor.image.dialog.tab.url')}
                {' '}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <Button className="richtext-w-full richtext-mt-1" size="sm" onClick={handleClick}>
                {t('editor.image.dialog.tab.upload')}
              </Button>
              <input
                type="file"
                accept="image/*"
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
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    required
                    placeholder={t('editor.image.dialog.placeholder')}
                  />
                  <Button type="submit">{t('editor.image.dialog.button.apply')}</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  )
}

export default ImageUploader
