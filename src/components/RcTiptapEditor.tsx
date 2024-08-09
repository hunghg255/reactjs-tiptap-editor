/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable import/named */
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';

import { AnyExtension, Editor as CoreEditor } from '@tiptap/core';
import { useEditor, EditorContent, UseEditorOptions } from '@tiptap/react';
import { differenceBy, throttle } from 'lodash-unified';

import BubbleMenuLink from '@/components/menus/components/BubbleMenuLink';
import { BubbleMenuImage, BubbleMenuVideo } from '@/components/menus/components/BubbleMenuMedia';
import BubbleMenuText from '@/components/menus/components/BubbleMenuText';
import ContentMenu from '@/components/menus/components/ContentMenu';
import Toolbar from '@/components/Toolbar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME } from '@/constants';
import ColumnsMenu from '@/extensions/MultiColumn/menus/ColumnsMenu';
import TableBubbleMenu from '@/extensions/Table/menus/TableBubbleMenu';
import { useLocale } from '@/locales';
import { themeActions } from '@/theme/theme';
import { hasExtension } from '@/utils/utils';

import '../styles/index.scss';

interface IPropsRcTiptapEditor {
  content: string;
  extensions: AnyExtension[];

  output: 'html' | 'json' | 'text';
  modelValue?: string | object;
  dark?: boolean;
  dense?: boolean;
  disabled?: boolean;
  label?: string;
  hideToolbar?: boolean;
  disableBubble?: boolean;
  hideBubble?: boolean;
  removeDefaultWrapper?: boolean;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  editorClass?: string | string[] | Record<string, any>;
  contentClass?: string | string[] | Record<string, any>;
  onChangeContent?: (val: any) => void;

  useEditorOptions?: UseEditorOptions;
}

function RcTiptapEditor(props: IPropsRcTiptapEditor, ref: any) {
  const { content, extensions, useEditorOptions = {} } = props;
  const { t } = useLocale();

  const sortExtensions = useMemo(() => {
    const diff = differenceBy(extensions, extensions, 'name');
    const exts = extensions.map((k: any) => {
      const find = extensions.find((ext: any) => ext.name === k.name);
      if (!find) {
        return k;
      }
      return k.configure(find.options);
    });
    return [...exts, ...diff].map((k, i) => k.configure({ sort: i }));
  }, [extensions]);

  const editor = useEditor({
    extensions: sortExtensions,
    content,
    onUpdate: ({ editor }) => {
      onValueChange(editor);
    },
    ...useEditorOptions,
  });

  useEffect(() => {
    document.body.classList.toggle('dark', props.dark);
    themeActions.setTheme(props.dark ? 'dark' : 'light');
  }, [props.dark]);

  useEffect(() => {
    editor?.setEditable(!props?.disabled);
  }, [editor, props?.disabled]);

  function getOutput(editor: CoreEditor, output: IPropsRcTiptapEditor['output']) {
    // eslint-disable-next-line unicorn/consistent-destructuring
    if (props?.removeDefaultWrapper) {
      if (output === 'html') {
        return editor.isEmpty ? '' : editor.getHTML();
      }
      if (output === 'json') {
        return editor.isEmpty ? {} : editor.getJSON();
      }
      if (output === 'text') {
        return editor.isEmpty ? '' : editor.getText();
      }
      return '';
    }

    if (output === 'html') {
      return editor.getHTML();
    }
    if (output === 'json') {
      return editor.getJSON();
    }
    if (output === 'text') {
      return editor.getText();
    }
    return '';
  }

  const onValueChange = throttle((editor) => {
    const output = getOutput(editor, props.output as any);

    props?.onChangeContent?.(output as any);
  }, EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME);

  useImperativeHandle(ref, () => {
    return {
      editor,
    };
  });

  useEffect(() => {
    return () => {
      editor?.destroy?.();
    };
  }, []);

  const hasExtensionValue = hasExtension(editor as any, 'characterCount');

  if (!editor) {
    return <></>;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className='reactjs-tiptap-editor rounded-[0.5rem] bg-background shadow overflow-hidden outline outline-1'>
        {!props?.hideBubble && (
          <>
            <ColumnsMenu editor={editor} />
            <TableBubbleMenu editor={editor} />
            <ContentMenu editor={editor} disabled={props?.disabled} />

            <BubbleMenuLink editor={editor} disabled={props?.disabled} />
            <BubbleMenuText editor={editor} disabled={props?.disabled} />
            <BubbleMenuImage editor={editor as any} disabled={props?.disabled} />
            <BubbleMenuVideo editor={editor as any} disabled={props?.disabled} />
          </>
        )}

        <div className='flex flex-col w-full max-h-full'>
          {!props?.hideToolbar && <Toolbar editor={editor} disabled={props?.disabled} />}

          <EditorContent className={`relative ${props?.contentClass || ''}`} editor={editor} />

          <div className='flex justify-between border-t p-3 items-center'>
            {hasExtensionValue && (
              <div className='flex flex-col'>
                <div className='flex justify-end gap-3 text-sm'>
                  <span>
                    {(editor as any).storage.characterCount.characters()} {t('editor.characters')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default forwardRef(RcTiptapEditor);
