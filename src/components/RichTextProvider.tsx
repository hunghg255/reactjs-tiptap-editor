import '../styles/index.scss';

import { type Editor } from '@tiptap/core';
import { EditorContext } from '@tiptap/react';
import { useEffect, useId } from 'react';

import { TooltipProvider } from '@/components';
import { ReactBusProvider } from '@/components/ReactBus';
import SlashDialogTrigger from '@/components/SlashDialogTrigger/SlashDialogTrigger';
import { RESET_CSS } from '@/constants/resetCSS';
import { EditorEditableReactive } from '@/store/EditorEditableReactive';
import { ThemeColorReactive } from '@/store/ThemeColorReactive';
import { removeCSS, updateCSS } from '@/utils/dynamicCSS';

interface IProviderRichTextProps {
  editor: Editor;
  children: React.ReactNode;
  dark?: boolean;
}

export function RichTextProvider({ editor, children }: IProviderRichTextProps) {
  const id = useId();

  useEffect(() => {
    updateCSS(RESET_CSS, 'react-tiptap-reset');

    return () => {
      removeCSS('react-tiptap-reset');
    };
  }, []);

  useEffect(() => {
    //@ts-expect-error
    if (editor) editor.id = id;
  }, [id, editor]);

  if (!editor) {
    return <></>;
  }

  return (
    <div className='reactjs-tiptap-editor'>
      <ReactBusProvider>
        <EditorContext.Provider value={{ editor }}>
          <TooltipProvider delayDuration={0} disableHoverableContent>
            {children}
          </TooltipProvider>

          <EditorEditableReactive editor={editor} />

          <SlashDialogTrigger />
          <ThemeColorReactive />
        </EditorContext.Provider>
      </ReactBusProvider>
    </div>
  );
}
