/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
// @ts-ignore
import svg64 from 'svg64'

import type { Editor } from '@tiptap/core'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ActionButton } from '@/components/ActionButton'
import { Button } from '@/components/ui'
import { Textarea } from '@/components/ui/textarea'
import { shortId } from '@/utils/shortId'
import { dataURLtoFile } from '@/utils/file'

interface IProps { editor: Editor, upload?: any }

const defaultCode = 'graph TB\na-->b'

export const MermaidActiveButton: React.FC<IProps> = ({ editor, upload }) => {
  const [mermaidCode, setMermaidCode] = useState(defaultCode)
  const [svgCode, setSvgCode] = useState('')
  const [visible, toggleVisible] = useState(false)
  const mermaidRef = useRef<HTMLElement | null>(null)

  const renderMermaid = async (value: any) => {
    try {
      const { svg } = await mermaid.render('mermaid-svg', value)
      setSvgCode(svg)
    }
    catch {
      setSvgCode('')
    }
  }

  const mermaidInit = () => {
    mermaid.initialize({
      darkMode: false,
      startOnLoad: false,
      // fontFamily:'',
      fontSize: 12,
      theme: 'base',
    })
    renderMermaid(mermaidCode)
  }

  useEffect(() => {
    if (visible) {
      mermaidInit()
    }
  }, [visible])

  useEffect(() => {
    if (visible) {
      renderMermaid(mermaidCode)
    }
  }, [mermaidCode])

  const setMermaid = async () => {
    if (mermaidCode === '') {
      return
    }
    if (mermaidCode) {
      const svg = mermaidRef.current!.querySelector('svg') as unknown as HTMLElement
      const { width, height } = svg.getBoundingClientRect()
      const name = `mermaid-${shortId()}.svg`
      // const { size } = new Blob([svg.outerHTML], {
      //   type: 'image/svg+xml',
      // })

      let src = svg64(svg.outerHTML)

      if (upload) {
        const file = dataURLtoFile(src, name)
        src = await upload(file)
      }

      editor
        ?.chain()
        .focus()
        .setMermaid(
          {
            type: 'mermaid',
            src,
            alt: encodeURIComponent(mermaidCode),
            width,
            height,
          },
          !!mermaidCode,
        )
        .run()
    }
    toggleVisible(false)
  }

  return (
    <Dialog
      open={visible}
      onOpenChange={toggleVisible}
    >
      <DialogTrigger asChild>
        <ActionButton
          icon="Mermaid"
          tooltip="Mermaid"
          action={() => toggleVisible(true)}
        />
      </DialogTrigger>
      <DialogContent className="!richtext-max-w-[1300px] richtext-z-[99999]">
        <DialogTitle>Mermaid</DialogTitle>

        <div style={{ height: '100%', borderWidth: 1 }}>
          <div className="richtext-flex richtext-gap-[10px] richtext-rounded-[10px] richtext-p-[10px]">
            <Textarea
              className="richtext-flex-1"
              value={mermaidCode}
              onChange={e => setMermaidCode(e.target.value)}
              autoFocus
              required
              rows={10}
              defaultValue={defaultCode}
              placeholder="Text"
              style={{
                color: 'hsl(var(--richtext-foreground))',
              }}
            />

            <div
              className="richtext-flex-1 richtext-flex richtext-items-center richtext-justify-center richtext-rounded-[10px] richtext-p-[10px]"
              style={{ height: '100%', borderWidth: 1, minHeight: 500, background: '#fff' }}
              ref={mermaidRef as any}
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={setMermaid}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
