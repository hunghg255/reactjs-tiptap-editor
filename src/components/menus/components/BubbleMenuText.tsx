import { useMemo } from 'react';

import type { Editor } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';
import { BubbleMenu } from '@tiptap/react';

import { Separator, getBubbleText } from '@/components';
import { useLocale } from '@/locales';

export interface BubbleMenuTextProps {
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
    <Comp
      {...item.componentProps}
      disabled={disabled || item?.componentProps?.disabled}
      editor={editor}
    />
  );
}

function BubbleMenuText(props: BubbleMenuTextProps) {
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

    return getBubbleText(props.editor, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled, props.editor, lang, t]);

  return (
    <BubbleMenu editor={props?.editor}
      shouldShow={shouldShow}
      tippyOptions={tippyOptions as any}
    >
      {items?.length
        ? (
          <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
            <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-gap-[4px] richtext-whitespace-nowrap">
              {items?.map((item: any, key: any) => {
                if (item?.type === 'divider') {
                  return (
                    <Separator
                      className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
                      key={`bubbleMenu-divider-${key}`}
                      orientation="vertical"
                    />
                  );
                }

                return (
                  <ItemA
                    disabled={props.disabled}
                    editor={props.editor}
                    item={item}
                    key={`bubbleMenu-text-${key}`}
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

export { BubbleMenuText };
