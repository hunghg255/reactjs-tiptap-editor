import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BubbleMenu } from '@tiptap/react';
import katex from 'katex';
import { HelpCircle, Pencil, Trash2 } from 'lucide-react';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { Katex } from '@/extensions/Katex';
import type { IKatexAttrs } from '@/extensions/Katex';
import { useAttributes } from '@/hooks/useAttributes';
import { deleteNode } from '@/utils/delete-node';

function BubbleMenuKatex({ editor, ...props }: any) {
  const attrs = useAttributes<IKatexAttrs>(editor, Katex.name, {
    text: '',
    defaultShowPicker: false,
  });
  const { text, defaultShowPicker } = attrs;

  const [currentValue, setCurrentValue] = useState('');
  const [visible, toggleVisible] = useState(false);

  const shouldShow = useCallback(() => editor.isActive(Katex.name), [editor]);

  const deleteMe = useCallback(() => deleteNode(Katex.name, editor), [editor]);

  const submit = useCallback(() => {
    editor.chain().focus().setKatex({ text: currentValue }).run();
    toggleVisible(false);
  }, [editor, currentValue]);

  useEffect(() => {
    if (defaultShowPicker) {
      toggleVisible(true);
      editor.chain().updateAttributes(Katex.name, { defaultShowPicker: false }).focus().run();
    }
  }, [editor, defaultShowPicker, toggleVisible]);

  useEffect(() => {
    if (visible)
      setCurrentValue(text || '');
  }, [visible]);

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${currentValue}`);
    } catch {
      return currentValue;
    }
  }, [currentValue]);

  const previewContent = useMemo(
    () => {
      if (`${currentValue}`.trim()) {
        return (
          <span contentEditable={false}
            dangerouslySetInnerHTML={{ __html: formatText || '' }}
          >
          </span>
        );
      }

      return null;
    },
    [currentValue, formatText],
  );

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="Katex-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        placement: 'bottom-start',
        offset: [-2, 16],
        zIndex: 9999,
        onHidden: () => {
          toggleVisible(false);
        },
      }}
    >
      {props?.disabled
        ? (
          <></>
        )
        : (
          <div className="richtext-rounded-lg !richtext-border richtext-border-neutral-200 richtext-bg-white richtext-p-2 richtext-shadow-sm dark:richtext-border-neutral-800 dark:richtext-bg-black">
            {visible
              ? (
                <>
                  <Textarea
                    autoFocus
                    defaultValue={text}
                    onChange={e => setCurrentValue(e.target.value)}
                    placeholder="Formula text"
                    rows={3}
                    style={{ marginBottom: 8 }}
                    value={currentValue}
                  />

                  {previewContent && (
                    <div className="richtext-my-[10px] richtext-overflow-auto richtext-whitespace-nowrap richtext-rounded-[6px] !richtext-border richtext-p-[10px]">
                      {previewContent}
                    </div>
                  )}

                  <div className="richtext-flex richtext-items-center richtext-justify-between richtext-gap-[6px]">
                    <Button className="richtext-flex-1"
                      onClick={submit}
                    >
                      Submit
                    </Button>

                    <a href="https://katex.org/docs/supported"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      <HelpCircle size={16} />
                    </a>
                  </div>
                </>
              )
              : (
                <div className="richtext-flex richtext-items-center richtext-justify-center richtext-gap-[6px]">
                  <ActionButton action={() => toggleVisible(!visible)}
                    tooltip="Edit"
                  >
                    <Pencil size={16} />
                  </ActionButton>

                  <ActionButton action={deleteMe}
                    tooltip="Delete"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </div>
              )}
          </div>
        )}

    </BubbleMenu>
  );
}

export {
  BubbleMenuKatex
};
