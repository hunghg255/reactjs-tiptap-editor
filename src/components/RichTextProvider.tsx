import { useEffect, useId } from 'react';
import { type Editor } from '@tiptap/core';
import { TooltipProvider } from '@/components';
import { ProviderEditor, useStoreEditor } from '@/store/editor';
import { ProviderUniqueId } from '@/store/ProviderUniqueId';
import { removeCSS, updateCSS } from '@/utils/dynamicCSS';
import { RESET_CSS } from '@/constants/resetCSS';
import { themeActions } from '@/theme/theme';

import '../styles/index.scss';

interface IProviderRichTextProps {
  editor: Editor
  children: React.ReactNode
  dark?: boolean
}

function InitialStore({ editor, children }: { editor: Editor, children: React.ReactNode }) {
  const [editorState, setEditor] = useStoreEditor(store => store.editor);

  useEffect(() => {
    setEditor({
      editor: editor as any
    });
  }, [editor]);

  if (!editorState) {
    return <></>;
  }

  return (
    <>
      {children}
    </>
  );
}

export function RichTextProvider({ editor, children, dark }: IProviderRichTextProps) {
  const id = useId();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    themeActions.setTheme(id, dark ? 'dark' : 'light');
  }, [dark]);

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
      <ProviderEditor>
        <ProviderUniqueId
          editor={editor}
          id={id}
        >
          <TooltipProvider delayDuration={0}
            disableHoverableContent
          >
            <InitialStore editor={editor}>
              {children}
            </InitialStore>

          </TooltipProvider>
        </ProviderUniqueId>
      </ProviderEditor>
    </div>
  );
}
