import { RichTextBubbleImage } from 'reactjs-tiptap-editor/bubble/media';
import { RichTextBubbleText } from 'reactjs-tiptap-editor/bubble/text';
import { Katex } from 'reactjs-tiptap-editor/katex';
import { localeActions, useLocale } from 'reactjs-tiptap-editor/locale';
import vi from 'reactjs-tiptap-editor/locales/vi';

export const deferredKatex = Katex.configure({
  loadKatex: async () => (await import('katex')).default,
});

import '../src/extensions/Mermaid/Mermaid';
import '../src/extensions/ImageGif/ImageGif';

export function checkLocaleEntryPoints() {
  localeActions.setMessage('vi', vi);
  localeActions.setLang('vi');
  return { useLocale, RichTextBubbleText, RichTextBubbleImage };
}

import type { ActionButtonProps } from '../src/components/ActionButton';
import type { IImageOptions, SetImageAttrsOptions } from '../src/extensions/Image/Image';
import type { ButtonViewReturnComponentProps, ToolbarItemProps } from '../src/types';
import type { SuggestionHandle } from '../src/utils/renderNodeView';
import type { Editor } from '@tiptap/core';

// This function is never executed. tsc verifies both supported calls and rejected payloads.
export function checkPublicTypes(editor: Editor) {
  editor.commands.setImageInline({ src: '/image.png', inline: true, width: '50%' });
  editor.commands.setImageGif({ src: '/animation.gif', align: 'center' });
  editor.commands.setMermaid({ src: '/diagram.svg', width: 320 }, true);
  // @ts-expect-error Image sources must be strings.
  editor.commands.setImageInline({ src: 123 });
  // @ts-expect-error Only supported image alignments are accepted.
  editor.commands.setAlignImageGif('justify');
  // @ts-expect-error Replacement is a boolean, not a selection position.
  editor.commands.setMermaid({ src: '/diagram.svg' }, 42);
}

export const image: SetImageAttrsOptions = { src: '/image.png', width: null, inline: false };
export const upload: IImageOptions['upload'] = async (file) => URL.createObjectURL(file);
// @ts-expect-error Upload callbacks must resolve to a URL string.
export const invalidUpload: IImageOptions['upload'] = async () => 123;

export const action: ActionButtonProps['action'] = (event) => event.currentTarget.focus();
export const customAction: ButtonViewReturnComponentProps<string> = {
  action(value) {
    value?.toUpperCase();
  },
};
export const customToolbar: ToolbarItemProps<{ label: string }> = {
  button: { component: ({ label }) => label, componentProps: { label: 'Insert' } },
  divider: false,
  spacer: false,
  type: 'custom',
  name: 'custom',
};
export const keyboardHandle: SuggestionHandle = {
  onKeyDown: ({ event }) => event.key === 'Escape',
};
// @ts-expect-error Suggestion handlers must return whether they handled the key.
export const invalidKeyboardHandle: SuggestionHandle = { onKeyDown: () => 'handled' };
