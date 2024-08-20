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

    <NodeViewWrapper as="section">
      {!props?.node?.attrs?.src && (
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
      {props?.node?.attrs?.src && (
        <iframe
          src={props?.node?.attrs?.src}
          frameBorder="0"
          allowFullScreen={true}
          title={props?.node?.attrs?.src}
          className="richtext-my-[12px]"
        >
        </iframe>
      )}
    </NodeViewWrapper>
  )
}

export default IframeNodeView
