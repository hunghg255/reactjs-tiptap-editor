import { Fragment, useMemo } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';

import { Separator } from '@/components';
import { Image } from '@/extensions/Image';
import {  ImageGif } from '@/extensions/ImageGif';
import { Video } from '@/extensions/Video';
import { useLocale } from '@/locales';
import { useEditableEditor } from '@/store/store';
import { useEditorInstance } from '@/store/editor';
import { getBubbleImage, getBubbleImageGif, getBubbleVideo } from '@/components/Bubble/formatBubble';

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
            disabled={disabled || item?.componentdisabled}
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

function RichTextBubbleImage() {
  const { lang, t } = useLocale();
  const editable = useEditableEditor();
  const editor = useEditorInstance();

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
    return getBubbleImage(editor, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, lang, t]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      options={{ placement: 'bottom', offset: 8, flip: true }}
    >
      {items?.length
        ? (
          <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
            <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-whitespace-nowrap">
              {items?.map((item: any, key: any) => {
                return (
                  <ItemA
                    editor={editor}
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
    </BubbleMenu>
  );
}

function RichTextBubbleImageGif() {
  const { lang, t } = useLocale();
  const editable = useEditableEditor();
  const editor = useEditorInstance();

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
    return getBubbleImageGif(editor, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, t, lang]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      options={{ placement: 'bottom', offset: 8, flip: true }}
    >
      {items?.length
        ? (
          <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
            <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-whitespace-nowrap">
              {items?.map((item: any, key: any) => {
                return (
                  <ItemA
                    editor={editor}
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
    </BubbleMenu>
  );
}

function RichTextBubbleVideo() {
  const { t } = useLocale();
  const editable = useEditableEditor();
  const editor = useEditorInstance();

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
    return getBubbleVideo(editor, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, t]);

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      options={{ placement: 'bottom', offset: 8, flip: true }}
    >
      {items?.length
        ? (
          <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
            <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-whitespace-nowrap">
              {items?.map((item: any, key: any) => {
                return (
                  <ItemA
                    editor={editor}
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
    </BubbleMenu>
  );
}

export { RichTextBubbleImage, RichTextBubbleVideo, RichTextBubbleImageGif };
