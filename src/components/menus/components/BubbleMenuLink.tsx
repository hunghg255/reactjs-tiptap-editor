/* eslint-disable multiline-ternary */
import React, { useCallback, useMemo, useState } from 'react';

import { BubbleMenu } from '@tiptap/react';

import LinkEditBlock from '@/extensions/Link/components/LinkEditBlock';
import LinkViewBlock from '@/extensions/Link/components/LinkViewBlock';

const BubbleMenuLink = (props: any) => {
  const [showEdit, setShowEdit] = useState(false);

  const link = useMemo(() => {
    const { href: link } = props.editor.getAttributes('link');
    return link;
  }, [props]);

  const shouldShow: any = useCallback(({ editor }: any) => {
    const isActive = editor.isActive('link');
    return isActive;
  }, []);

  const onSetLink = (url: string, text?: string, openInNewTab?: boolean) => {
    props.editor
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
      .focus()
      .run();
    setShowEdit(false);
  };

  const unSetLink = useCallback(() => {
    props.editor.chain().extendMarkRange('link').unsetLink().focus().run();
    setShowEdit(false);
  }, [props.editor]);

  return (
    <>
      <BubbleMenu
        editor={props?.editor}
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
        {props?.disabled ? (
          <></>
        ) : (
          <>
            {showEdit ? (
              <LinkEditBlock onSetLink={onSetLink} editor={props?.editor} />
            ) : (
              <LinkViewBlock
                editor={props?.editor}
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
};

export default BubbleMenuLink;
