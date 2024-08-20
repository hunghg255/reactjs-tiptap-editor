import { useCallback, useEffect, useRef } from 'react'

import { HelpCircle } from 'lucide-react'
import { ActionButton, Button, Label, Popover, PopoverContent, PopoverTrigger } from '@/components'
import { Textarea } from '@/components/ui/textarea'
import type { IKatexAttrs } from '@/extensions/Katex/Katex'
import { Katex } from '@/extensions/Katex/Katex'
import { useAttributes } from '@/hooks/useAttributes'
import { useLocale } from '@/locales'

function KatexActiveButton({ editor, ...props }: any) {
  const { t } = useLocale()

  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    defaultShowPicker: false,
  })
  const { text, defaultShowPicker } = attrs
  const ref: any = useRef<HTMLTextAreaElement>(null)

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: ref.current.value }).run()
  }, [editor])

  useEffect(() => {
    if (defaultShowPicker) {
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run()
    }
  }, [editor, defaultShowPicker])

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 200)
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ActionButton
          tooltip={props?.tooltip}
          icon={props?.icon}
        />
      </PopoverTrigger>

      <PopoverContent hideWhenDetached className="w-full h-full p-2" align="start" side="bottom">
        <Label className="mb-[6px]">
          {t('editor.formula.dialog.text')}
        </Label>
        <div className="flex w-full max-w-sm items-center gap-1.5 mb-[16px]">
          <div className="relative w-full max-w-sm">
            <Textarea
              ref={ref}
              autoFocus
              required
              rows={3}
              defaultValue={text}
              className="w-full"
              placeholder="Text"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-[6px]">
          <Button onClick={submit} className="flex-1">Submit</Button>

          <a href="https://katex.org/" target="_blank" rel="noreferrer noopener">
            <HelpCircle size={16} />
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default KatexActiveButton
