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

/**
 * Pre-processes markdown text to fix table formatting.
 * When copying from many sources, blank lines get inserted between table rows,
 * which prevents marked's GFM table parser from recognizing them.
 * This collapses blank lines between pipe-delimited rows into a contiguous block.
 */
function fixMarkdownTables(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if this is a blank line sitting between two table rows
    if (trimmed === '' && result.length > 0) {
      // Look ahead to find the next non-empty line
      let nextNonEmpty = i + 1;
      while (nextNonEmpty < lines.length && lines[nextNonEmpty].trim() === '') {
        nextNonEmpty++;
      }

      const prevLine = result[result.length - 1].trim();
      const nextLine = nextNonEmpty < lines.length ? lines[nextNonEmpty].trim() : '';

      // If both the previous and next non-empty lines look like table rows, skip this blank line
      if (prevLine.startsWith('|') && prevLine.endsWith('|') &&
          nextLine.startsWith('|') && nextLine.endsWith('|')) {
        continue;
      }
    }

    result.push(line);
  }

  return result.join('\n');
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

            const rawText = clipboardData.getData('text/plain');
            if (!rawText || !looksLikeMarkdown(rawText)) return false;

            // Fix table formatting — collapse blank lines between pipe-delimited rows
            const text = fixMarkdownTables(rawText);

            // Usage: https://marked.js.org/#usage
            // marked.parse() synchronously converts a markdown string to HTML.
            let converted = marked.parse(text, {
              gfm: true,
              breaks: true,
            }) as string;

            // Strip <thead> and <tbody> wrappers — TipTap's table schema only
            // understands <table>, <tr>, <th>, and <td>. The wrapper tags are
            // unknown nodes that get dropped during ProseMirror parsing.
            converted = converted.replace(/<\/?(thead|tbody)>/g, '');

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
