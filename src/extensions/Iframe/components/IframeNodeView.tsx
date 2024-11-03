/* eslint-disable react-dom/no-missing-iframe-sandbox */
import { useCallback, useState } from 'react'

import { NodeViewWrapper } from '@tiptap/react'

import { Resizable } from 're-resizable'
import clsx from 'clsx'
import styles from './index.module.scss'
// import { getEditorContainerDOMSize } from '@/utils'
import { Button, Input } from '@/components/ui'
import { Iframe } from '@/extensions/Iframe/Iframe'
import { useEditableEditor } from '@/store/editableEditor'

function IframeNodeView({ editor, node, updateAttributes }: any) {
  const isEditable = useEditableEditor()

  const { url, width, height } = node.attrs
  // const { width: maxWidth } = getEditorContainerDOMSize(editor)

  const [originalLink, setOriginalLink] = useState<string>('')

  function handleConfirm() {
    if (!originalLink) {
      return
    }

    editor
      .chain()
      .updateAttributes(Iframe.name, {
        url: originalLink,
      })
      .setNodeSelection(editor.state.selection.from)
      .focus()
      .run()
  }

  const onResize = useCallback(
    (size: any) => {
      updateAttributes({ width: size.width, height: size.height })
    },
    [updateAttributes],
  )

  return (
    <NodeViewWrapper>
      {!url && (
        <div className="richtext-max-w-[600px] richtext-mx-[auto] richtext-my-[12px] richtext-flex richtext-items-center richtext-justify-center richtext-gap-[10px] richtext-p-[10px] richtext-border-[1px] richtext-border-solid richtext-border-[#ccc] richtext-rounded-[12px]">
          <Input
            value={originalLink}
            onInput={(e: any) => setOriginalLink(e.target.value)}
            type="url"
            className="richtext-flex-1"
            autoFocus
            placeholder="Enter link"
          />
          <Button className="richtext-w-[60px]" onClick={handleConfirm}>
            OK
          </Button>
        </div>
      )}

      {url && (
        <Resizable
          size={{ width: Number.parseInt(width), height: Number.parseInt(height) }}
          onResizeStop={(e, direction, ref, d) => {
            onResize({
              width: Number.parseInt(width) + d.width,
              height: Number.parseInt(height) + d.height,
            })
          }}
        >
          <div className={clsx(styles.wrap, 'render-wrapper')}>
            <div className={styles.innerWrap} style={{ pointerEvents: !isEditable ? 'auto' : 'none' }}>
              <iframe
                src={url}
                className="richtext-my-[12px] "
              >
              </iframe>
            </div>
          </div>
        </Resizable>
      )}
    </NodeViewWrapper>
  )
}

export default IframeNodeView
