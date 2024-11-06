import { useRef, useState } from 'react'

import { ActionButton, Button, Input, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useLocale } from '@/locales'
import { actionDialogVideo, useDialogVideo } from '@/extensions/Video/store'

function ActionVideoButton(props: any) {
  const { t } = useLocale()

  const [link, setLink] = useState<string>('')
  const fileInput = useRef<HTMLInputElement>(null)

  const dialogVideo = useDialogVideo()

  async function handleFile(event: any) {
    const files = event?.target?.files
    if (!props.editor || props.editor.isDestroyed || files.length === 0) {
      return
    }
    const file = files[0]
    const uploadOptions = props.editor.extensionManager.extensions.find(
      (extension: any) => extension.name === 'video',
    )?.options

    let src = ''
    if (uploadOptions.upload) {
      src = await uploadOptions.upload(file)
    }
    else {
      src = URL.createObjectURL(file)
    }

    props.editor
      .chain()
      .setVideo({
        src,
        width: '100%',
      })
      .focus()
      .run()
    actionDialogVideo.setOpen(false)
  }
  function handleLink(e: any) {
    e.preventDefault()
    e.stopPropagation()

    props.editor
      .chain()
      .setVideo({
        src: link,
        width: '100%',
      })
      .focus()
      .run()
    actionDialogVideo.setOpen(false)
  }

  function handleClick(e: any) {
    e.preventDefault()
    fileInput.current?.click()
  }

  return (
    <Dialog open={dialogVideo.isOpen} onOpenChange={actionDialogVideo.setOpen}>
      <DialogTrigger asChild>
        <ActionButton
          icon={props.icon}
          action={() => actionDialogVideo.setOpen(true)}
          tooltip={props.tooltip}
        />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>{t('editor.video.dialog.title')}</DialogTitle>

        <Tabs defaultValue="upload" activationMode="manual">
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
            <div className="richtext-flex richtext-items-center richtext-gap-[10px]">
              <Button className="richtext-w-full richtext-mt-1" size="sm" onClick={handleClick}>
                {t('editor.video.dialog.tab.upload')}
              </Button>
            </div>
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
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  required
                  placeholder={t('editor.video.dialog.placeholder')}
                />
                <Button type="submit">{t('editor.video.dialog.button.apply')}</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default ActionVideoButton
