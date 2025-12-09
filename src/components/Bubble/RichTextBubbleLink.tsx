import { useCallback, useState } from 'react';

import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

import LinkEditBlock from '@/extensions/Link/components/LinkEditBlock';
import LinkViewBlock from '@/extensions/Link/components/LinkViewBlock';
import { Link } from '@/extensions/Link/Link';
import { useAttributes } from '@/hooks/useAttributes';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

export interface BubbleMenuLinkProps {
  editor: Editor;
  disabled?: boolean;
}

export function RichTextBubbleLink() {
  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const [showEdit, setShowEdit] = useState(false);
  const attrs = useAttributes<any>(editor, Link.name);
  const link = attrs?.href;

  const shouldShow = useCallback(({ editor }: { editor: Editor }) => {
    const isActive = editor.isActive(Link.name);
    return isActive;
  }, []);

  const onSetLink = (url: string, text?: string, openInNewTab?: boolean) => {
    const selection = editor.state.selection;
    const { from } = selection;

    const insertedLength = text?.length ?? 0;
    const newTo = from + insertedLength;

    editor
      .chain()
      .extendMarkRange('link')
      .insertContent({
        type: 'text',
        text,
        marks: [
          {
            type: 'link',
            attrs: {
              href: url,
              target: openInNewTab ? '_blank' : '',
            },
          },
        ],
      })
      .setLink({ href: url })
      .setTextSelection({ from, to: newTo }) // 👈 Select inserted text
      .focus()
      .run();

    setShowEdit(false);
  };

  const unSetLink = useCallback(() => {
    editor.chain().extendMarkRange('link').unsetLink().focus().run();
    setShowEdit(false);
  }, [editor]);

  const onClose = () => {
    setShowEdit(false);
  };

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'bottom', offset: 8, flip: true }}
      shouldShow={shouldShow}
    >
      <>
        {showEdit ? (
          <div
            className='richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-4 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none'
          >
            <LinkEditBlock editor={editor}
              onClose={onClose}
              onSetLink={onSetLink}
            />
          </div>
        ) : (
          <div
            className='richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none'
          >
            <LinkViewBlock
              editor={editor}
              link={link}
              onClear={unSetLink}
              onEdit={() => {
                setShowEdit(true);
              }}
            />
          </div>
        )}
      </>
    </BubbleMenu>
  );
}
