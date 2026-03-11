import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
// Installation: npm install marked
// See: https://marked.js.org/#installation
import { marked } from 'marked';

/**
 * Checks whether pasted plain text looks like markdown by matching
 * against common structural patterns. Requires 2+ matches to avoid
 * false positives, with an exception for unambiguous leading headings.
 */
function looksLikeMarkdown(text: string): boolean {
  const patterns = [
    /^#{1,6}\s+/m,           // Headings: ## Heading
    /^\s*[-*+]\s+/m,         // Unordered lists: - item
    /^\s*\d+\.\s+/m,         // Ordered lists: 1. item
    /^\s*>\s+/m,             // Blockquotes: > quote
    /\*\*.+?\*\*/,           // Bold: **text**
    /\*.+?\*/,               // Italic: *text*
    /`[^`]+`/,               // Inline code: `code`
    /^```/m,                 // Code blocks: ```
    /^\s*---\s*$/m,          // Horizontal rules: ---
    /^\s*\*\*\*\s*$/m,       // Horizontal rules: ***
    /\[.+?\]\(.+?\)/,        // Links: [text](url)
    /!\[.*?\]\(.+?\)/,       // Images: ![alt](url)
    /^\s*[-*]\s+\[[ x]\]/m,  // Task lists: - [ ] or - [x]
    /\|.+\|.+\|/,            // Tables: |col|col|
  ];

  let matches = 0;
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      matches++;
      if (matches >= 2) return true;
    }
  }

  // A leading heading like "# Title" is unambiguous markdown
  if (/^#{1,6}\s+/.test(text.trim())) return true;

  return false;
}

export interface MarkdownPasteOptions {
  enabled: boolean;
}

export const MarkdownPaste = Extension.create<MarkdownPasteOptions>({
  name: 'markdownPaste',

  addOptions() {
    return {
      enabled: true,
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('markdownPaste'),
        props: {
          handlePaste: (_view, event) => {
            if (!this.options.enabled) return false;

            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const html = clipboardData.getData('text/html');
            const text = clipboardData.getData('text/plain');

            // Debug logging — remove these once it's working
            console.log('[MarkdownPaste] paste event fired');
            console.log('[MarkdownPaste] has html:', !!html?.trim());
            console.log('[MarkdownPaste] text:', text?.substring(0, 100));
            console.log('[MarkdownPaste] looksLikeMarkdown:', text ? looksLikeMarkdown(text) : false);

            // If the clipboard already has HTML, the source provides rich
            // formatting — let TipTap's default HTML paste handle it.
            if (html && html.trim().length > 0) return false;

            if (!text || !looksLikeMarkdown(text)) return false;

            // Usage: https://marked.js.org/#usage
            // marked.parse() synchronously converts a markdown string to HTML.
            const converted = marked.parse(text, {
              gfm: true,
              breaks: true,
            }) as string;

            editor.commands.insertContent(converted, {
              parseOptions: { preserveWhitespace: false },
            });

            return true;
          },
        },
      }),
    ];
  },
});
