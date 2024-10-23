/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { useCallback, useEffect, useMemo, useState } from 'react'

import { HelpCircle } from 'lucide-react'
import katex from 'katex'
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

  const [currentValue, setCurrentValue] = useState('')

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: currentValue }).run()
    setCurrentValue('')
  }, [editor, currentValue])

  useEffect(() => {
    if (defaultShowPicker) {
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run()
    }
  }, [editor, defaultShowPicker])

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${currentValue}`)
    }
    catch {
      return currentValue
    }
  }, [currentValue])

  const previewContent = useMemo(
    () => {
      if (`${currentValue}`.trim()) {
        return (
          <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText || '' }}></span>
        )
      }

      return null
    },
    [currentValue, formatText],
  )

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <ActionButton
          tooltip={props?.tooltip}
          icon={props?.icon}
        />
      </PopoverTrigger>

      <PopoverContent hideWhenDetached className="richtext-w-full richtext-h-full richtext-p-2" align="start" side="bottom">
        <Label className="richtext-mb-[6px]">
          {t('editor.formula.dialog.text')}
        </Label>
        <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5 richtext-mb-[16px]">
          <div className="richtext-relative richtext-w-full richtext-max-w-sm">
            <Textarea
              value={currentValue}
              onChange={e => setCurrentValue(e.target.value)}
              autoFocus
              required
              rows={3}
              defaultValue={text}
              className="richtext-w-full"
              placeholder="Text"
            />
          </div>
        </div>

        {previewContent && (
          <div className="richtext-my-[10px] richtext-p-[10px] richtext-rounded-[6px] !richtext-border-[1px] richtext-max-w-[286px] richtext-whitespace-nowrap richtext-overflow-auto">
            {previewContent}
          </div>
        )}
        <div className="richtext-flex richtext-items-center richtext-justify-between richtext-gap-[6px]">
          <Button onClick={submit} className="richtext-flex-1">Submit</Button>

          <a href="https://katex.org/docs/supported" target="_blank" rel="noreferrer noopener">
            <HelpCircle size={16} />
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default KatexActiveButton
