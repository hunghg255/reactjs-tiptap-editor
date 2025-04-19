import { Fragment, useMemo } from 'react';

import type { Editor } from '@tiptap/react';
import { BubbleMenu as BubbleMenuReact } from '@tiptap/react';

import { Separator, getBubbleImage, getBubbleImageGif, getBubbleVideo } from '@/components';
import { Image } from '@/extensions/Image';
import {  ImageGif } from '@/extensions/ImageGif';
import { Video } from '@/extensions/Video';
import { useLocale } from '@/locales';

interface IPropsBubbleMenu {
  editor: Editor
  disabled?: boolean
}

const tippyOptions = {
  maxWidth: 'auto',
  zIndex: 20,
  appendTo: 'parent',
  moveTransition: 'transform 0.1s ease-out',
};

function ItemA({ item, disabled, editor }: any) {
  const Comp = item.component;

  if (!Comp) {
    return <></>;
  }

  return (
    <Fragment>
      {item.type === 'divider'
        ? (
          <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
            orientation="vertical"
          />
        )
        : (
          <Comp
            {...item.componentProps}
            disabled={disabled || item?.componentProps?.disabled}
            editor={editor}
          />
        )}
    </Fragment>
  );
}

function isImageNode(node: any) {
  return node.type.name === Image.name;
}

function isImageGifNode(node: any) {
  return node.type.name === ImageGif.name;
}

function isVideoNode(node: any) {
  return node.type.name === Video.name;
}

function BubbleMenuImage(props: IPropsBubbleMenu) {
  const { lang } = useLocale();

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isImage = false;

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (isImageNode(node)) {
        isImage = true;
        return false; // Stop iteration if an image is found
      }
    });

    return isImage;
  };

  const items = useMemo(() => {
    if (props.disabled) {
      return [];
    }
    return getBubbleImage(props.editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang]);

  return (
    <>
      <BubbleMenuReact
        editor={props?.editor}
        shouldShow={shouldShow}
        tippyOptions={tippyOptions as any}
      >
        {items?.length
          ? (
            <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
              <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-whitespace-nowrap">
                {items?.map((item: any, key: any) => {
                  return (
                    <ItemA
                      disabled={props.disabled}
                      editor={props.editor}
                      item={item}
                      key={`bubbleMenu-image-${key}`}
                    />
                  );
                })}
              </div>
            </div>
          )
          : (
            <></>
          )}
      </BubbleMenuReact>
    </>
  );
}

function BubbleMenuImageGif(props: IPropsBubbleMenu) {
  const { lang } = useLocale();

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isImage = false;

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (isImageGifNode(node)) {
        isImage = true;
        return false; // Stop iteration if an image is found
      }
    });

    return isImage;
  };

  const items = useMemo(() => {
    if (props.disabled) {
      return [];
    }
    return getBubbleImageGif(props.editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang]);

  return (
    <>
      <BubbleMenuReact
        editor={props?.editor}
        shouldShow={shouldShow}
        tippyOptions={tippyOptions as any}
      >
        {items?.length
          ? (
            <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
              <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-whitespace-nowrap">
                {items?.map((item: any, key: any) => {
                  return (
                    <ItemA
                      disabled={props.disabled}
                      editor={props.editor}
                      item={item}
                      key={`bubbleMenu-image-gif-${key}`}
                    />
                  );
                })}
              </div>
            </div>
          )
          : (
            <></>
          )}
      </BubbleMenuReact>
    </>
  );
}

function BubbleMenuVideo(props: IPropsBubbleMenu) {
  const { lang } = useLocale();

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isVideo = false;

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (isVideoNode(node)) {
        isVideo = true;
        return false;
      }
    });

    return isVideo;
  };

  const items = useMemo(() => {
    if (props.disabled) {
      return [];
    }

    return getBubbleVideo(props.editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editor, props.disabled, lang]);

  return (
    <>
      <BubbleMenuReact
        editor={props?.editor}
        shouldShow={shouldShow}
        tippyOptions={tippyOptions as any}
      >
        {items?.length
          ? (
            <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
              <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-whitespace-nowrap">
                {items?.map((item: any, key: any) => {
                  return (
                    <ItemA
                      disabled={props.disabled}
                      editor={props.editor}
                      item={item}
                      key={`bubbleMenu-video-${key}`}
                    />
                  );
                })}
              </div>
            </div>
          )
          : (
            <></>
          )}
      </BubbleMenuReact>
    </>
  );
}

export { BubbleMenuImage, BubbleMenuVideo, BubbleMenuImageGif };
