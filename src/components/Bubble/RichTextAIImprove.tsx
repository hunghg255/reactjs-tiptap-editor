import { Languages, Minimize2, Sparkles, SpellCheck, WandSparkles } from 'lucide-react';
import { useRef, useState } from 'react';

import { ActionButton } from '@/components/ActionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEditorInstance } from '@/store/editor';

import type { Range } from '@tiptap/core';

const actions = [
  {
    label: 'Fix spelling & grammar',
    icon: SpellCheck,
    prompt:
      'Correct spelling and grammar in the selected text. Preserve its meaning, language, and tone. Return only the corrected text.',
  },
  {
    label: 'Improve clarity',
    icon: WandSparkles,
    prompt:
      'Rewrite the selected text for clarity and natural flow. Preserve all facts, meaning, and the original language. Return only the rewritten text.',
  },
  {
    label: 'Shorten text',
    icon: Minimize2,
    prompt:
      'Make the selected text more concise while preserving its key information and original language. Return only the shortened text.',
  },
  {
    label: 'Translate to Vietnamese',
    icon: Languages,
    prompt:
      'Translate the selected text into Vietnamese. Preserve meaning and proper names. Return only the translation.',
  },
  {
    label: 'Translate to English',
    icon: Languages,
    prompt:
      'Translate the selected text into English. Preserve meaning and proper names. Return only the translation.',
  },
];

/** Can also be used inside a custom buttonBubble. */
export function RichTextAIImprove() {
  const editor = useEditorInstance();
  const [menuContainer, setMenuContainer] = useState<HTMLDivElement | null>(null);
  const selection = useRef<Range | null>(null);
  const document = useRef(editor.state.doc);
  if (!editor.extensionManager.extensions.some((extension) => extension.name === 'ai')) return null;

  function run(prompt?: string) {
    const range = selection.current;
    // Do not overwrite a selection captured before a collaborative edit.
    if (!range || document.current !== editor.state.doc || !editor.isEditable) return;
    editor.chain().setTextSelection(range).openAI(prompt).run();
  }

  return (
    <div ref={setMenuContainer} className='richtext-ai-improve-anchor'>
      <DropdownMenu
        modal={false}
        onOpenChange={(open) => {
          if (open) {
            const { from, to } = editor.state.selection;
            selection.current = from < to ? { from, to } : null;
            document.current = editor.state.doc;
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <ActionButton
            aria-label='Improve selected text'
            customClass='richtext-ai-improve-trigger !richtext-w-auto'
          >
            <Sparkles size={16} /> Improve
          </ActionButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          portalContainer={menuContainer}
          align='start'
          side='bottom'
          className='richtext-ai-improve-menu'
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {actions.map(({ label, icon: Icon, prompt }) => (
            <DropdownMenuItem
              key={label}
              className='richtext-ai-improve-item'
              onSelect={() => run(prompt)}
            >
              <Icon size={17} />
              {label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='richtext-ai-improve-item' onSelect={() => run()}>
            <Sparkles size={17} />
            Ask AI
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
