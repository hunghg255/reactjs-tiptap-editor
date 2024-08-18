import React, { useState } from 'react'

import { NodeViewWrapper } from '@tiptap/react'

import { Button, Input } from '@/components'
import { getServiceSrc } from '@/extensions/Iframe/embed'

function IframeNodeView(props: any) {
  const [originalLink, setOriginalLink] = useState<string>('')

  function handleConfirm() {
    if (!originalLink) {
      return
    }

    const result = getServiceSrc(originalLink)
    if (result.validLink && result.validId) {
      props.updateAttributes({ src: result.src })
    }
  }

  return (
    <>
      <NodeViewWrapper as="section">
        {!props?.node?.attrs?.src && (
          <div className="max-w-[600px] mx-[auto] my-[12px] flex items-center justify-center gap-[10px] p-[10px] border-[1px] border-solid border-[#ccc] rounded-[12px]">
            <Input
              value={originalLink}
              onInput={(e: any) => setOriginalLink(e.target.value)}
              type="url"
              className="flex-1"
              autoFocus
              placeholder="Enter link"
            />
            <Button className="w-[60px]" onClick={handleConfirm}>
              OK
            </Button>
          </div>
        )}
        {props?.node?.attrs?.src && (
          <iframe
            src={props?.node?.attrs?.src}
            frameBorder="0"
            allowFullScreen={true}
            title={props?.node?.attrs?.src}
            className="my-[12px]"
          >
          </iframe>
        )}
      </NodeViewWrapper>
    </>
  )
}

export default IframeNodeView
