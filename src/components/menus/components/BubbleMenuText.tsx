/* eslint-disable import/named */
/* eslint-disable multiline-ternary */
/* eslint-disable unicorn/consistent-function-scoping */
import React, { Fragment, useMemo } from 'react';

import { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { BubbleMenu } from '@tiptap/react';

import { getBubbleText } from '@/components/menus/bubble';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/locales';

interface IPropsBubbleMenuText {
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
      <Comp
        {...item.componentProps}
        editor={editor}
        disabled={disabled || item?.componentProps?.disabled}
      />
    </Fragment>
  );
};

const BubbleMenuText = (props: IPropsBubbleMenuText) => {
  const { t, lang } = useLocale();

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;

    // check content select length is not empty
    if ($from.pos === to) {
      return false;
    }

    return selection instanceof TextSelection;
  };

  const items = useMemo(() => {
    if (props.disabled || !props?.editor) {
      return [];
    }

    return getBubbleText(props.editor as any, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang, t]);

  return (
    <>
      <BubbleMenu shouldShow={shouldShow} editor={props?.editor} tippyOptions={tippyOptions as any}>
        {items?.length ? (
          <div className='border border-neutral-200 dark:border-neutral-800 px-3 py-2 transition-all select-none pointer-events-auto shadow-sm rounded-sm w-auto bg-background'>
            <div className='flex items-center gap-[4px] flex-nowrap whitespace-nowrap h-[26px] justify-start relative'>
              {items?.map((item: any, key: any) => {
                if (item?.type === 'divider') {
                  return (
                    <Separator
                      key={`bubbleMenu-divider-${key}`}
                      orientation='vertical'
                      className='mx-1 me-2 h-[16px]'
                    />
                  );
                }

                return (
                  <ItemA
                    key={`bubbleMenu-text-${key}`}
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
      </BubbleMenu>
    </>
  );
};

export default BubbleMenuText;
