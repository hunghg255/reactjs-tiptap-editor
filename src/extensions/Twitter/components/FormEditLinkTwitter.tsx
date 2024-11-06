import { useEffect, useState } from 'react'

import { Button, Input, Label } from '@/components'
import { useLocale } from '@/locales'
import { Twitter } from '@/extensions/Twitter/Twitter'

interface IPropsFormEditLinkTwitter {
  editor: any
  onSetLink: (src: string) => void
}

function FormEditLinkTwitter(props: IPropsFormEditLinkTwitter) {
  const { t } = useLocale()

  const [src, setSrc] = useState('')

  useEffect(() => {
    if (props?.editor) {
      const { src: srcInit } = props.editor?.getAttributes(Twitter.name)

      if (srcInit) {
        setSrc(srcInit)
      }
    }
  }, [props?.editor])

  function handleSubmit(event: any) {
    event.preventDefault()
    event.stopPropagation()
    props?.onSetLink(src)
  }

  return (
    <div className="richtext-p-2 richtext-bg-white !richtext-border richtext-rounded-lg richtext-shadow-sm dark:richtext-bg-black border-neutral-200 dark:richtext-border-neutral-800">
      <form className="richtext-flex richtext-flex-col richtext-gap-2" onSubmit={handleSubmit}>
        <Label className="mb-[6px]">
          {t('editor.link.dialog.text')}
        </Label>

        <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5 richtext-mb-[10px]">
          <div className="richtext-relative richtext-items-center richtext-w-full richtext-max-w-sm">
            <Input
              type="text"
              value={src}
              required
              className="richtext-w-80"
              placeholder="Text"
              onChange={e => setSrc(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="richtext-self-end richtext-mt-2">
          {t('editor.link.dialog.button.apply')}
        </Button>
      </form>
    </div>
  )
}

export default FormEditLinkTwitter
