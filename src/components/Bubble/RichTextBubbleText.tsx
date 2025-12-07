import { TextSelection } from '@tiptap/pm/state';
import { BubbleMenu } from '@tiptap/react/menus';

import { Separator } from '@/components/ui';
import { RichTextBold } from '@/extensions/Bold';
import { RichTextCode } from '@/extensions/Code';
import { RichTextColor } from '@/extensions/Color';
import { RichTextHighlight } from '@/extensions/Highlight';
import { RichTextItalic } from '@/extensions/Italic';
import { RichTextLink } from '@/extensions/Link';
import { RichTextStrike } from '@/extensions/Strike';
import { RichTextAlign } from '@/extensions/TextAlign';
import { RichTextUnderline } from '@/extensions/TextUnderline';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

interface RichTextBubbleTextProps {
  buttonBubble?: React.ReactNode
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

function DefaultButtonBubble () {
  return (
<>
    <RichTextBold />
    <RichTextItalic />
    <RichTextUnderline />
    <RichTextUnderline />
    <RichTextStrike />
    <RichTextCode/>
    <RichTextLink />

    <Separator className="!richtext-mx-1 !richtext-my-2 !richtext-h-[16px]"
      orientation="vertical"
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
    <BubbleMenu editor={editor}
      options={{ placement: 'bottom', offset: 8, flip: true }}
      shouldShow={shouldShow}
    >
      {buttonBubble
        ? (
          <>
{buttonBubble}
          </>
        )
        : (
          <div className="richtext-pointer-events-auto richtext-w-auto richtext-select-none richtext-rounded-sm !richtext-border richtext-border-neutral-200 richtext-bg-background richtext-px-3 richtext-py-2 richtext-shadow-sm richtext-transition-all dark:richtext-border-neutral-800">
            <div className="richtext-relative richtext-flex richtext-h-[26px] richtext-flex-nowrap richtext-items-center richtext-justify-start richtext-gap-[4px] richtext-whitespace-nowrap">
              <DefaultButtonBubble />
            </div>
          </div>
        )}
    </BubbleMenu>
  );
}
