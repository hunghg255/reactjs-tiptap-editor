import { TextSelection } from '@tiptap/pm/state';
import { BubbleMenu } from '@tiptap/react/menus';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ActionButton } from '@/components';
import { IconComponent } from '@/components/icons';
import { Popover, PopoverContent, PopoverTrigger, Separator } from '@/components/ui';
import { RichTextBold } from '@/extensions/Bold';
import { RichTextCode } from '@/extensions/Code';
import { RichTextColor } from '@/extensions/Color';
import { RichTextHighlight } from '@/extensions/Highlight';
import { RichTextItalic } from '@/extensions/Italic';
import { RichTextLink } from '@/extensions/Link';
import { renderCommandListDefault } from '@/extensions/SlashCommand';
import { RichTextStrike } from '@/extensions/Strike';
import { RichTextAlign } from '@/extensions/TextAlign';
import { RichTextUnderline } from '@/extensions/TextUnderline';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

interface RichTextBubbleTextProps {
  buttonBubble?: React.ReactNode;
}

// export const BUBBLE_TEXT_LIST = [
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'code',
//   'link',
//   'color',
//   'highlight',
//   'textAlign',
// ];

function ParagraphFormat() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  const editor = useEditorInstance();
  const items = useMemo(() => {
    return renderCommandListDefault({ t })?.[0]?.commands;
  }, [t]);

  const label = useMemo(() => {
    const label = items?.find((item) => item?.isActive?.(editor))?.label;
    return label;
  }, [editor.state.selection.ranges, open, editor, items, t]);

  return (
    <Popover modal onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        asChild
        className='hover:richtext-bg-accent data-[state=on]:richtext-bg-accent'
      >
        <ActionButton dataState={!!label}>
          {label ? <>{label}</> : <>{t('editor.paragraph.tooltip')}</>}

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
        {items?.map((item) => {
          const isActive = item?.isActive?.(editor);

          return (
            <div
              className='richtext-flex richtext-w-full richtext-items-center richtext-gap-3 richtext-rounded-sm !richtext-border-none !richtext-bg-transparent richtext-px-2 richtext-py-1.5 richtext-text-left richtext-text-sm richtext-text-foreground !richtext-outline-none richtext-transition-colors hover:!richtext-bg-accent'
              key={item.name}
              onClick={(e) => {
                e.preventDefault();
                item.action({
                  editor,
                  range: editor.state.selection.ranges as any,
                });
                setOpen(false);
              }}
            >
              <div className='!richtext-min-w-[20px]'>
                {isActive && <Check size={16} />}
                {!label && item.label === t('editor.paragraph.tooltip') && !isActive && (
                  <Check size={16} />
                )}
              </div>

              <div className='richtext-flex richtext-items-center richtext-gap-1'>
                {item.iconName && (
                  <IconComponent
                    className='!richtext-mr-1 !richtext-text-lg'
                    name={item.iconName}
                  />
                )}

                {item.label}
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function DefaultButtonBubble() {
  return (
    <>
      <ParagraphFormat />

      <Separator
        className='!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]'
        orientation='vertical'
      />

      <RichTextBold />
      <RichTextItalic />
      <RichTextUnderline />
      <RichTextStrike />
      <RichTextCode />
      <RichTextLink />

      <Separator
        className='!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]'
        orientation='vertical'
      />

      <RichTextColor />
      <RichTextHighlight />
      <RichTextAlign />
    </>
  );
}

export function RichTextBubbleText({ buttonBubble }: RichTextBubbleTextProps) {
  const editor = useEditorInstance();
  const editable = useEditableEditor();

  const shouldShow = ({ editor }: any) => {
    const { selection } = editor.view.state;
    const { $from, to } = selection;

    // check content select length is not empty
    if ($from.pos === to) {
      return false;
    }

    return selection instanceof TextSelection;
  };

  if (!editable) {
    return <></>;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'bottom', offset: 8, flip: true }}
      pluginKey={'RichTextBubbleText'}
      shouldShow={shouldShow}
    >
      {buttonBubble ? (
        <>{buttonBubble}</>
      ) : (
        <div className='richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-md !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none'>
          <DefaultButtonBubble />
        </div>
      )}
    </BubbleMenu>
  );
}
