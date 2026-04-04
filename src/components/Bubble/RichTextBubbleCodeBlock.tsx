import { BubbleMenu } from '@tiptap/react/menus';
import { Check, Copy, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { ActionButton } from '@/components/ActionButton';
import { IconComponent } from '@/components/icons';
import { Popover, PopoverContent, PopoverTrigger, Separator } from '@/components/ui';
import { CodeBlock } from '@/extensions/CodeBlock';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';
import { deleteNode } from '@/utils/delete-node';

import type { Editor } from '@tiptap/react';

const MAP_LANGUAGE_LABEL: Record<string, string> = {
  plaintext: 'Plain Text',
  js: 'JavaScript',
  ts: 'TypeScript',
  css: 'CSS',
  html: 'HTML',
  python: 'Python',
  bash: 'Bash',
};

function SelectLanguages({ listLanguages }: { listLanguages: string[] }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const editor = useEditorInstance();

  const currentLanguageActive = useMemo(() => {
    const { selection } = editor.state;
    const node = selection.$from.parent;

    // Check if the current node is a codeBlock and get its language attribute
    if (node.type.name === 'codeBlock') {
      const currentLanguage = node.attrs.language || 'plaintext';
      return MAP_LANGUAGE_LABEL[currentLanguage] || currentLanguage;
    }
  }, [editor.state, listLanguages]);

  const list = useMemo(() => {
    let listLanguagesFormat = listLanguages || [];

    if (!listLanguages?.includes('plaintext')) {
      listLanguagesFormat = ['plaintext', ...listLanguagesFormat];
    }

    return listLanguagesFormat.map((language) => {
      return {
        label: MAP_LANGUAGE_LABEL[language] || language,
        value: language,
      };
    });
  }, [listLanguages]);

  return (
    <Popover modal onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        asChild
        className='hover:richtext-bg-accent data-[state=on]:richtext-bg-accent'
      >
        <ActionButton dataState={!!currentLanguageActive}>
          {currentLanguageActive ? (
            <>{currentLanguageActive}</>
          ) : (
            <>{t('editor.paragraph.tooltip')}</>
          )}

          <IconComponent
            className='richtext-ml-1 richtext-size-3 richtext-text-zinc-500'
            name='MenuDown'
          />
        </ActionButton>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        className='!richtext-w-[initial] !richtext-p-[4px]'
        hideWhenDetached
        side='bottom'
      >
        {list?.map((item) => {
          return (
            <div
              className='richtext-flex richtext-w-full richtext-items-center richtext-gap-3 richtext-rounded-sm !richtext-border-none !richtext-bg-transparent richtext-px-2 richtext-py-1.5 richtext-text-left richtext-text-sm richtext-text-foreground !richtext-outline-none richtext-transition-colors hover:!richtext-bg-accent'
              key={item.value}
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().setCodeBlock({ language: item.value }).run();
                setOpen(false);
              }}
            >
              <div className='!richtext-min-w-[20px]'>
                {currentLanguageActive === item.value && <Check size={16} />}
              </div>

              <div className='richtext-flex richtext-items-center richtext-gap-1'>{item.label}</div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function RichTextBubbleCodeBlock() {
  const editable = useEditableEditor();
  const editor = useEditorInstance();

  const extension = useExtension(CodeBlock.name);

  const shouldShow = useCallback(({ editor }: { editor: Editor }) => {
    const isActive = editor.isActive(CodeBlock.name);
    return isActive;
  }, []);

  const listLanguages = useMemo(() => {
    if (!extension) return [];
    return (
      extension.options?.lowlight?.listLanguages?.() || ['plaintext', 'html', 'css', 'js', 'ts']
    );
  }, [extension]);

  const deleteMe = useCallback(() => deleteNode(CodeBlock.name, editor), [editor]);

  const getCodeContent = () => {
    const { from } = editor.state.selection;
    const resolvedPos = editor.state.doc.resolve(from);

    // Leo lên tìm node codeBlock
    for (let depth = resolvedPos.depth; depth >= 0; depth--) {
      const node = resolvedPos.node(depth);
      if (node.type.name === 'codeBlock') {
        return node.textContent;
      }
    }
    return '';
  };

  // Dùng trong button copy
  const handleCopy = () => {
    const code = getCodeContent();
    navigator.clipboard.writeText(code);
  };

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'bottom', offset: 8, flip: true }}
      pluginKey={'RichTextBubbleCodeBlock'}
      shouldShow={shouldShow}
      getReferencedVirtualElement={() => {
        const { from } = editor.state.selection;
        const node = editor.view.domAtPos(from).node as any;

        const el = node.parentElement;

        if (!el) return null;

        // Floating UI cần VirtualElement: object có getBoundingClientRect là function
        return {
          getBoundingClientRect: () => el.getBoundingClientRect(),
        };
      }}
    >
      <div className='richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none'>
        <SelectLanguages listLanguages={listLanguages} />

        <Separator
          className='!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]'
          orientation='vertical'
        />
        <ActionButton action={handleCopy} tooltip='Copy'>
          <Copy size={16} />
        </ActionButton>
        <Separator
          className='!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]'
          orientation='vertical'
        />

        <ActionButton action={deleteMe} tooltip='Delete'>
          <Trash2 size={16} />
        </ActionButton>
      </div>
    </BubbleMenu>
  );
}
