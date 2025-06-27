import { useCallback, useMemo, useState } from 'react';

import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';

import LinkEditBlock from '@/extensions/Link/components/LinkEditBlock';
import LinkViewBlock from '@/extensions/Link/components/LinkViewBlock';

export interface BubbleMenuLinkProps {
  editor: Editor;
  disabled?: boolean;
}

function BubbleMenuLink({ editor, disabled }: BubbleMenuLinkProps) {
  const [showEdit, setShowEdit] = useState(false);

  const link = useMemo(() => {
    const { href: link } = editor.getAttributes('link');
    return link as string;
  }, [editor]);

  const shouldShow = useCallback(({ editor }: { editor: Editor }) => {
    const isActive = editor.isActive('link');
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

  return (
    <>
      <BubbleMenu
        editor={editor}
        shouldShow={shouldShow}
        tippyOptions={{
          popperOptions: {
            modifiers: [{ name: 'flip', enabled: false }],
          },
          placement: 'bottom-start',
          offset: [-2, 16],
          zIndex: 9999,
          onHidden: () => {
            setShowEdit(false);
          },
        }}
      >
        {disabled ? (
          <></>
        ) : (
          <>
            {showEdit ? (
              <LinkEditBlock onSetLink={onSetLink} editor={editor} />
            ) : (
              <LinkViewBlock
                editor={editor}
                onClear={unSetLink}
                onEdit={() => {
                  setShowEdit(true);
                }}
                link={link}
              />
            )}
          </>
        )}
      </BubbleMenu>
    </>
  );
}

export { BubbleMenuLink };
