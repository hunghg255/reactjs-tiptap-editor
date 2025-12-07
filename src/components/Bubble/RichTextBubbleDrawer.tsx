import { Fragment, useMemo } from 'react';

import { BubbleMenu } from '@tiptap/react/menus';

import { Separator } from '@/components';
import { Drawer } from '@/extensions/Drawer';
import { EditDrawerBlock } from '@/extensions/Drawer/components/EditDrawerBlock';
import { useAttributes } from '@/hooks/useAttributes';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { getBubbleDrawer } from '@/components/Bubble/formatBubble';
import { useEditableEditor } from '@/store/store';

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

export function RichTextBubbleDrawer() {
  const { lang, t } = useLocale();
  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const attrs = useAttributes<any>(editor, Drawer.name);

  const extension = useExtension(Drawer.name);

  const shouldShow = ({ editor }: any) => {

    const { selection } = editor.view.state;
    const { $from, to } = selection;
    let isDrawer = false;

    editor.view.state.doc.nodesBetween($from.pos, to, (node: any) => {
      if (node.type.name === Drawer.name) {
        isDrawer = true;
        return false; // Stop iteration if an mermaid is found
      }
    });

    return isDrawer;
  };

  const items = useMemo(() => {
    return getBubbleDrawer(editor, t);
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
                if (item.type === 'edit' && attrs?.src) {
                  return (
                    <EditDrawerBlock
                      attrs={attrs}
                      editor={editor}
                      extension={extension}
                      key={`bubbleMenu-drawer-${key}`}
                    />
                  );
                }

                return (
                  <ItemA
                    editor={editor}
                    item={item}
                    key={`bubbleMenu-drawer-${key}`}
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
