import CodeBlock from '@tiptap/extension-code-block';

import { RangiPlugin } from './rangi-plugin.js';

import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import type { ShjLanguages } from 'rangi';

export interface CodeBlockRangiOptions extends CodeBlockOptions {
  /** Custom Rangi grammars, keyed by language name. */
  languages?: ShjLanguages;

  /** Detect the language when neither the node nor the extension specifies one. */
  detectLanguage?: boolean;

  /** Prefix applied to Rangi token types in the rendered decoration classes. */
  tokenClassPrefix?: string;
}

/**
 * A Tiptap code block with syntax highlighting powered by Rangi.
 */
export const CodeBlockRangi = CodeBlock.extend<CodeBlockRangiOptions>({
  //@ts-expect-error
  addOptions() {
    return {
      ...this.parent?.(),
      languages: undefined,
      detectLanguage: true,
      tokenClassPrefix: 'shj-',
      languageClassPrefix: 'language-',
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      defaultLanguage: null,
      enableTabIndentation: false,
      tabSize: 4,
      HTMLAttributes: {
        class: 'shj',
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      RangiPlugin({
        name: this.name,
        languages: this.options.languages,
        defaultLanguage: this.options.defaultLanguage,
        detect: this.options.detectLanguage ? true : false,
        tokenClassPrefix: this.options.tokenClassPrefix || 'shj-',
      }),
    ];
  },
});
