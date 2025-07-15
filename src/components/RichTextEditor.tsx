import { forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo } from 'react';

import type { AnyExtension, Editor as CoreEditor } from '@tiptap/core';
import type { UseEditorOptions } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import { differenceBy, throttle } from 'lodash-es';

import { BubbleMenu, Toolbar, TooltipProvider } from '@/components';
import CharactorCount from '@/components/CharactorCount';
import { Toaster } from '@/components/ui/toaster';
import { EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME } from '@/constants';
import { RESET_CSS } from '@/constants/resetCSS';
import { editableEditorActions } from '@/store/editableEditor';
import { ProviderRichText } from '@/store/ProviderRichText';
import { themeActions } from '@/theme/theme';
import type { BubbleMenuProps, ToolbarProps } from '@/types';
import { removeCSS, updateCSS } from '@/utils/dynamicCSS';
import { hasExtension } from '@/utils/utils';

import '../styles/index.scss';

/**
 * Interface for RichTextEditor component props
 */
export interface RichTextEditorProps {
  /** Content of the editor */
  content: string
  /** Extensions for the editor */
  extensions: AnyExtension[]

  /** Output format */
  output: 'html' | 'json' | 'text'
  /** Model value */
  modelValue?: string | object
  /** Dark mode flag */
  dark?: boolean
  /** Dense mode flag */
  dense?: boolean
  /** Disabled flag */
  disabled?: boolean
  /** Label for the editor */
  label?: string
  /** Hide toolbar flag */
  hideToolbar?: boolean
  /** Disable bubble menu flag */
  disableBubble?: boolean
  /** Hide bubble menu flag */
  hideBubble?: boolean
  /** Remove default wrapper flag */
  removeDefaultWrapper?: boolean
  /** Maximum width */
  maxWidth?: string | number
  /** Minimum height */
  minHeight?: string | number
  /** Maximum height */
  maxHeight?: string | number
  /** Content class */
  contentClass?: string | string[] | Record<string, any>
  /** Content change callback */
  onChangeContent?: (val: any) => void
  /** Bubble menu props */
  bubbleMenu?: BubbleMenuProps
  /** Toolbar props */
  toolbar?: ToolbarProps

  /** Use editor options */
  useEditorOptions?: UseEditorOptions

  /** Use editor options */
  resetCSS?: boolean

  /** This option gives us the control to enable the default behavior of rendering the editor immediately.*/
  immediatelyRender?: boolean
}

function RichTextEditor(props: RichTextEditorProps, ref: React.ForwardedRef<{ editor: CoreEditor | null }>) {
  const { content, extensions, useEditorOptions = {} } = props;

  const id = useId();

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

  const onValueChange = throttle((editor) => {
    const output = getOutput(editor, props.output as any);

    props?.onChangeContent?.(output as any);
  }, EDITOR_UPDATE_WATCH_THROTTLE_WAIT_TIME);

  const editor = useEditor({
    extensions: sortExtensions,
    content,
    immediatelyRender: props?.immediatelyRender || false,
    onUpdate: ({ editor }) => {
      if (onValueChange)
        onValueChange(editor);
    },
    ...useEditorOptions,
  }) as any;

  useImperativeHandle(ref, () => {
    return {
      editor,
    };
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', props.dark);
    themeActions.setTheme(id, props.dark ? 'dark' : 'light');
  }, [props.dark]);

  useEffect(() => {
    editor?.setEditable(!props?.disabled);
    editableEditorActions.setDisable(id, !props?.disabled);
  }, [editor, props?.disabled]);

  useEffect(() => {
    if (props?.resetCSS !== false) {
      updateCSS(RESET_CSS, 'react-tiptap-reset');
    }

    return () => {
      removeCSS('react-tiptap-reset');
    };
  }, [props?.resetCSS]);

  function getOutput(editor: CoreEditor, output: RichTextEditorProps['output']) {
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

  useLayoutEffect(() => {
    if (editor) editor!.id = id;
  }, [id, editor]);

  useEffect(() => {
    return () => {
      editor?.destroy?.();
    };
  }, []);

  const hasExtensionValue = hasExtension(editor, 'characterCount');

  if (!editor) {
    return <></>;
  }

  return (
    <div className="reactjs-tiptap-editor">
      <ProviderRichText
        id={id}
      >
        <TooltipProvider delayDuration={0}
          disableHoverableContent
        >
          <div className="richtext-overflow-hidden richtext-rounded-[0.5rem] richtext-bg-background richtext-shadow richtext-outline richtext-outline-1">
            <div className="richtext-flex richtext-max-h-full richtext-w-full richtext-flex-col">
              {!props?.hideToolbar && <Toolbar disabled={!!props?.disabled}
                editor={editor}
                toolbar={props.toolbar}
              />}

              <EditorContent className={`richtext-relative ${props?.contentClass || ''}`}
                editor={editor}

              />

              {hasExtensionValue && <CharactorCount editor={editor}
                extensions={extensions}
              />}

              {!props?.hideBubble && <BubbleMenu bubbleMenu={props?.bubbleMenu}
                disabled={props?.disabled}
                editor={editor}
              />}
            </div>
          </div>
        </TooltipProvider>
      </ProviderRichText>

      <Toaster />
    </div>
  );
}

export default forwardRef(RichTextEditor);
