import { useEffect, useId } from 'react';

import { type Editor } from '@tiptap/core';

import { TooltipProvider } from '@/components';
import { RESET_CSS } from '@/constants/resetCSS';
import { ProviderUniqueId } from '@/store/ProviderUniqueId';
import { removeCSS, updateCSS } from '@/utils/dynamicCSS';

import '../styles/index.scss';
import { EditorContext } from '@tiptap/react';

interface IProviderRichTextProps {
  editor: Editor
  children: React.ReactNode
  dark?: boolean
}

export function RichTextProvider({ editor, children }: IProviderRichTextProps) {
  const id = useId();

  useEffect(() => {
    // if (props?.resetCSS !== false) {
    updateCSS(RESET_CSS, 'react-tiptap-reset');
    // }

    return () => {
      removeCSS('react-tiptap-reset');
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    if (editor) editor.id = id;
  }, [id, editor]);

  if (!editor) {
    return <></>;
  }

  return (
    <div className="reactjs-tiptap-editor">
      <EditorContext.Provider value={{ editor }}>
        <ProviderUniqueId
          editor={editor}
          id={id}
        >
          <TooltipProvider delayDuration={0}
            disableHoverableContent
          >
              {children}

          </TooltipProvider>
        </ProviderUniqueId>
      </EditorContext.Provider>
    </div>
  );
}
