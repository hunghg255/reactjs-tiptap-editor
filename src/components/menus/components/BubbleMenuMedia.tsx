/* eslint-disable react/no-useless-fragment */
import { Fragment, useMemo } from 'react'

import type { Editor } from '@tiptap/react'
import { BubbleMenu as BubbleMenuReact } from '@tiptap/react'

import { Separator, getBubbleImage, getBubbleImageGif, getBubbleVideo } from '@/components'
import { useLocale } from '@/locales'
import { ImageGif } from '@/extensions'

interface IPropsBubbleMenu {
  editor: Editor
  disabled?: boolean
}

const tippyOptions = {
  maxWidth: 'auto',
  zIndex: 20,
  appendTo: 'parent',
  moveTransition: 'transform 0.1s ease-out',
}

function ItemA({ item, disabled, editor }: any) {
  const Comp = item.component

  if (!Comp) {
    return <></>
  }

  return (
    <Fragment>
      {item.type === 'divider'
        ? (
            <Separator orientation="vertical" className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]" />
          )
        : (
            <Comp
              {...item.componentProps}
              editor={editor}
              disabled={disabled || item?.componentProps?.disabled}
            />
          )}
    </Fragment>
  )
}

function isImageNode(node: any) {
  return node.type.name === 'image'
}

function isImageGifNode(node: any) {
  return node.type.name === ImageGif.name
}

function isVideoNode(node: any) {
  return node.type.name === 'video'
}

function BubbleMenuImage(props: IPropsBubbleMenu) {
  const { lang } = useLocale()

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state
    const { $from, to } = selection
    let isImage = false

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (isImageNode(node)) {
        isImage = true
        return false // Stop iteration if an image is found
      }
    })

    return isImage
  }

  const items = useMemo(() => {
    if (props.disabled) {
      return []
    }
    return getBubbleImage(props.editor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang])

  return (
    <>
      <BubbleMenuReact
        shouldShow={shouldShow}
        editor={props?.editor}
        tippyOptions={tippyOptions as any}
      >
        {items?.length
          ? (
              <div className="richtext-w-auto richtext-px-3 richtext-py-2 richtext-transition-all !richtext-border richtext-rounded-sm richtext-shadow-sm richtext-pointer-events-auto richtext-select-none richtext-border-neutral-200 dark:richtext-border-neutral-800 richtext-bg-background">
                <div className="richtext-flex richtext-items-center richtext-flex-nowrap richtext-whitespace-nowrap richtext-h-[26px] richtext-justify-start richtext-relative">
                  {items?.map((item: any, key: any) => {
                    return (
                      <ItemA
                        key={`bubbleMenu-image-${key}`}
                        item={item}
                        disabled={props.disabled}
                        editor={props.editor}
                      />
                    )
                  })}
                </div>
              </div>
            )
          : (
              <></>
            )}
      </BubbleMenuReact>
    </>
  )
}

function BubbleMenuImageGif(props: IPropsBubbleMenu) {
  const { lang } = useLocale()

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state
    const { $from, to } = selection
    let isImage = false

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (isImageGifNode(node)) {
        isImage = true
        return false // Stop iteration if an image is found
      }
    })

    return isImage
  }

  const items = useMemo(() => {
    if (props.disabled) {
      return []
    }
    return getBubbleImageGif(props.editor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang])

  return (
    <>
      <BubbleMenuReact
        shouldShow={shouldShow}
        editor={props?.editor}
        tippyOptions={tippyOptions as any}
      >
        {items?.length
          ? (
              <div className="richtext-w-auto richtext-px-3 richtext-py-2 richtext-transition-all !richtext-border richtext-rounded-sm richtext-shadow-sm richtext-pointer-events-auto richtext-select-none richtext-border-neutral-200 dark:richtext-border-neutral-800 richtext-bg-background">
                <div className="richtext-flex richtext-items-center richtext-flex-nowrap richtext-whitespace-nowrap richtext-h-[26px] richtext-justify-start richtext-relative">
                  {items?.map((item: any, key: any) => {
                    return (
                      <ItemA
                        key={`bubbleMenu-image-gif-${key}`}
                        item={item}
                        disabled={props.disabled}
                        editor={props.editor}
                      />
                    )
                  })}
                </div>
              </div>
            )
          : (
              <></>
            )}
      </BubbleMenuReact>
    </>
  )
}

function BubbleMenuVideo(props: IPropsBubbleMenu) {
  const { lang } = useLocale()

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state
    const { $from, to } = selection
    let isVideo = false

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (isVideoNode(node)) {
        isVideo = true
        return false
      }
    })

    return isVideo
  }

  const items = useMemo(() => {
    if (props.disabled) {
      return []
    }

    return getBubbleVideo(props.editor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editor, props.disabled, lang])

  return (
    <>
      <BubbleMenuReact
        shouldShow={shouldShow}
        editor={props?.editor}
        tippyOptions={tippyOptions as any}
      >
        {items?.length
          ? (
              <div className="richtext-w-auto richtext-px-3 richtext-py-2 richtext-transition-all !richtext-border richtext-rounded-sm richtext-shadow-sm richtext-pointer-events-auto richtext-select-none richtext-border-neutral-200 dark:richtext-border-neutral-800 richtext-bg-background">
                <div className="richtext-flex richtext-items-center richtext-flex-nowrap richtext-whitespace-nowrap richtext-h-[26px] richtext-justify-start richtext-relative">
                  {items?.map((item: any, key: any) => {
                    return (
                      <ItemA
                        key={`bubbleMenu-video-${key}`}
                        item={item}
                        disabled={props.disabled}
                        editor={props.editor}
                      />
                    )
                  })}
                </div>
              </div>
            )
          : (
              <></>
            )}
      </BubbleMenuReact>
    </>
  )
}

export { BubbleMenuImage, BubbleMenuVideo, BubbleMenuImageGif }
