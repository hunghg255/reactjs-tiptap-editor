import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { UndoRedo } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import '../src/styles/ai.scss';

import { RichTextAIImprove } from '../src/components/Bubble/RichTextAIImprove';
import { RichTextBubbleText } from '../src/components/Bubble/RichTextBubbleText';
import { RichTextProvider } from '../src/components/RichTextProvider';
import { AI, aiPluginKey } from '../src/extensions/AI/AI';
import { SlashCommand } from '../src/extensions/SlashCommand/SlashCommand';

function App() {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      UndoRedo,
      SlashCommand,
      AI.configure({
        generate: async ({ messages, signal }) => {
          await new Promise((resolve) => setTimeout(resolve, 250));
          signal.throwIfAborted();
          if (messages[0]?.content === 'Long preview')
            return Array.from(
              { length: 12 },
              (_, i) =>
                `Paragraph ${i + 1}. ` +
                'This is a long preview that must stay inside the editor and push following content down. '.repeat(
                  5
                )
            ).join('\n\n');
          return messages.length > 1
            ? 'A shorter, friendlier revision.'
            : 'A quiet moment can become the beginning of something remarkable. Write down the idea, follow your curiosity, and give it room to grow.';
        },
      }),
    ],
    content: '<p>Write something beautiful.</p>',
    editorProps: { attributes: { style: 'padding: 24px 80px;' } },
  });
  useEffect(() => {
    if (!editor) return;
    const checks: string[] = [];
    function check(value: unknown, label: string) {
      if (!value) throw new Error(label);
      checks.push(`PASS ${label}`);
    }
    const run = async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (location.search === '?improve') {
        editor.commands.setContent('<p>This sentence could be clearer and shorter.</p>');
        editor.commands.setTextSelection({ from: 1, to: 43 });
        editor.commands.focus();
        document.getElementById('results')!.textContent =
          'Select Improve to test a preset on this selection.';
        return;
      }
      check(editor.can().openAI(), 'can open');
      check(!aiPluginKey.getState(editor.state), 'can() has no side effects');
      editor.commands.setTextSelection({ from: 1, to: 26 });
      editor.commands.openAI();
      check(!!aiPluginKey.getState(editor.state), 'selection captured');
      editor.commands.applyAI('<script>alert(1)</script>');
      check(editor.getText().includes('<script>'), 'output inserted as literal text');
      check(!editor.getHTML().includes('<script>'), 'no HTML injection');
      check(!aiPluginKey.getState(editor.state), 'apply closes preview');
      editor.commands.undo();
      check(editor.getText() === 'Write something beautiful.', 'undo restores original');
      editor.commands.openAI();
      editor.commands.closeAI();
      check(editor.getText() === 'Write something beautiful.', 'discard preserves original');
      editor.commands.openAI();
      editor.commands.insertContent('change');
      check(!aiPluginKey.getState(editor.state), 'document edit invalidates preview');
      check(!editor.commands.applyAI('stale'), 'stale apply rejected');
      editor.setEditable(false);
      check(!editor.commands.openAI(), 'readonly rejects AI');
      editor.setEditable(true);
      editor.commands.setContent('<p></p>');
      editor.commands.setTextSelection(1);
      editor.commands.openAI();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const input = document.querySelector('textarea')!;
      check(!!input, 'prompt UI mounted');
      const panelRect = document.querySelector('.richtext-ai')!.getBoundingClientRect();
      const editorRect = editor.view.dom.getBoundingClientRect();
      const blockRect = { left: editorRect.left + 80, width: editorRect.width - 160 };
      check(Math.abs(panelRect.left - blockRect.left) < 1, 'panel aligns with padded text block');
      check(Math.abs(panelRect.width - blockRect.width) < 1, 'panel matches text block width');
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
      setter.call(input, 'Write an introduction');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 30));
      document.querySelector<HTMLButtonElement>('[aria-label="Send prompt"]')!.click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      check(!!document.querySelector('.richtext-ai-loading'), 'request shows compact loading bar');
      check(!document.querySelector('textarea'), 'prompt hidden during request');
      document.querySelector<HTMLButtonElement>('[aria-label="Stop generating"]')!.click();
      await new Promise((resolve) => setTimeout(resolve, 300));
      check(!document.querySelector('.richtext-ai-loading'), 'stop closes loading bar');
      check(
        document.querySelector('textarea')?.value === 'Write an introduction',
        'stop restores original prompt'
      );
      check(
        !document.querySelector('.richtext-ai-preview'),
        'stopped request cannot publish late result'
      );
      document.querySelector<HTMLButtonElement>('[aria-label="Send prompt"]')!.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const partial = document.querySelector('.richtext-ai-preview')!;
      while (!partial.textContent?.trim()) await new Promise(requestAnimationFrame);
      check(
        partial.textContent!.trim().length > 0 && partial.textContent!.trim().length < 133,
        'preview reveals progressively'
      );
      check(
        document.querySelector<HTMLButtonElement>('.richtext-ai-apply')!.disabled,
        'apply waits for reveal'
      );
      await new Promise((resolve) => setTimeout(resolve, 2500));
      check(!!document.querySelector('.richtext-ai-preview'), 'generation produces preview');
      check(editor.getText() === '', 'preview does not modify document');
      document.querySelector<HTMLButtonElement>('.richtext-ai-apply')!.click();
      check(editor.getText().startsWith('A quiet moment'), 'UI apply inserts result');
      editor.commands.undo();
      check(editor.getText() === '', 'UI apply undo');
      editor.commands.setContent('<p></p><p>Following content</p>');
      editor.commands.setTextSelection(1);
      editor.commands.openAI();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const longInput = document.querySelector('textarea')!;
      setter.call(longInput, 'Long preview');
      longInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 30));
      document.querySelector<HTMLButtonElement>('[aria-label="Send prompt"]')!.click();
      await new Promise((resolve) => setTimeout(resolve, 5600));
      const longPreview = document.querySelector('.richtext-ai-preview')!;
      const panel = document.querySelector('.richtext-ai')!;
      const longRect = panel.getBoundingClientRect();
      const bounds = editor.view.dom.getBoundingClientRect();
      check(editor.view.dom.contains(longPreview), 'preview belongs to editor DOM');
      check(longPreview.querySelectorAll('p').length === 12, 'preview renders real paragraphs');
      check(longRect.height > window.innerHeight, 'long preview is not viewport clipped');
      check(
        longRect.top >= bounds.top && longRect.bottom <= bounds.bottom,
        'editor grows to contain long preview'
      );
      check(
        editor.view.dom.lastElementChild!.getBoundingClientRect().top >= longRect.bottom,
        'preview pushes following content down'
      );
      check(
        !editor.getHTML().includes('Paragraph 1.'),
        'temporary preview excluded from saved HTML'
      );
      editor.commands.closeAI();
      check(
        editor.getText().trim() === 'Following content',
        'discard long preview preserves following content'
      );
      editor.commands.setContent('<p>This sentence could be clearer and shorter.</p>');
      editor.commands.setTextSelection({ from: 1, to: 43 });
      document.getElementById('results')!.textContent = checks.join('\n');
      editor.commands.focus();
    };
    run().catch((error) => {
      document.getElementById('results')!.textContent =
        `${checks.join('\n')}\nFAIL ${error.message}`;
    });
  }, [editor]);
  return editor ? (
    <RichTextProvider editor={editor}>
      <RichTextBubbleText buttonBubble={<RichTextAIImprove />} />
      <EditorContent editor={editor} />
    </RichTextProvider>
  ) : null;
}
createRoot(document.getElementById('root')!).render(<App />);
