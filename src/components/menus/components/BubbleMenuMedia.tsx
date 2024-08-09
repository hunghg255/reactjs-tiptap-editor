/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable indent */
/* eslint-disable import/named */
/* eslint-disable multiline-ternary */
import { Fragment, useMemo } from 'react';

import { BubbleMenu as BubbleMenuReact, Editor } from '@tiptap/react';

import { getBubbleImage, getBubbleVideo } from '@/components/menus/bubble';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/locales';

interface IPropsBubbleMenu {
  editor: Editor;
  disabled?: boolean;
}

const tippyOptions = {
  maxWidth: 'auto',
  zIndex: 20,
  appendTo: 'parent',
  moveTransition: 'transform 0.1s ease-out',
};

const ItemA = ({ item, disabled, editor }: any) => {
  const Comp = item.component;

  if (!Comp) {
    return <></>;
  }

  return (
    <Fragment>
      {item.type === 'divider' ? (
        <Separator orientation='vertical' className='mx-1 me-2 h-[16px]' />
      ) : (
        <>
          <Comp
            {...item.componentProps}
            editor={editor}
            disabled={disabled || item?.componentProps?.disabled}
          />
        </>
      )}
    </Fragment>
  );
};

const isImageNode = (node: any) => {
  return node.type.name === 'image';
};

const isVideoNode = (node: any) => {
  return node.type.name === 'video';
};

const BubbleMenuImage = (props: IPropsBubbleMenu) => {
  const { lang } = useLocale();

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isImage = false;

    // eslint-disable-next-line unicorn/consistent-destructuring
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
        shouldShow={shouldShow}
        editor={props?.editor}
        tippyOptions={tippyOptions as any}
      >
        {items?.length ? (
          <div className='border border-neutral-200 dark:border-neutral-800 px-3 py-2 transition-all select-none pointer-events-auto shadow-sm rounded-sm w-auto bg-background'>
            <div className='flex items-center flex-nowrap whitespace-nowrap h-[26px] justify-start relative'>
              {items?.map((item: any, key: any) => {
                return (
                  <ItemA
                    key={`bubbleMenu-image-${key}`}
                    item={item}
                    disabled={props.disabled}
                    editor={props.editor}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </BubbleMenuReact>
    </>
  );
};

const BubbleMenuVideo = (props: IPropsBubbleMenu) => {
  const { lang } = useLocale();

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isVideo = false;

    // eslint-disable-next-line unicorn/consistent-destructuring
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
        shouldShow={shouldShow}
        editor={props?.editor}
        tippyOptions={tippyOptions as any}
      >
        {items?.length ? (
          <div className='border border-neutral-200 dark:border-neutral-800 px-3 py-2 transition-all select-none pointer-events-auto shadow-sm rounded-sm w-auto bg-background'>
            <div className='flex items-center flex-nowrap whitespace-nowrap h-[26px] justify-start relative'>
              {items?.map((item: any, key: any) => {
                return (
                  <ItemA
                    key={`bubbleMenu-video-${key}`}
                    item={item}
                    disabled={props.disabled}
                    editor={props.editor}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </BubbleMenuReact>
    </>
  );
};

export { BubbleMenuImage, BubbleMenuVideo };
