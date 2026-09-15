import { getExtensionField, getHTMLFromFragment } from '@tiptap/core';
import { MarkdownManager } from '@tiptap/markdown';
import { Fragment } from '@tiptap/pm/model';

import type { AnyExtension, Editor, JSONContent, NodeConfig } from '@tiptap/core';
import type { Schema } from '@tiptap/pm/model';

type RenderMarkdown = NonNullable<NodeConfig['renderMarkdown']>;

const CALLOUT_LABELS: Record<string, string> = {
  note: 'NOTE',
  tip: 'TIP',
  important: 'IMPORTANT',
  warning: 'WARNING',
  caution: 'CAUTION',
};

function joinBlocks(node: JSONContent, h: Parameters<RenderMarkdown>[1]) {
  return node.content ? h.renderChildren(node.content, '\n\n') : '';
}

/**
 * Markdown renderers for nodes and marks shipped by this package that have no
 * spec of their own. Nodes not listed here fall back to raw HTML.
 */
const RENDERERS: Record<string, RenderMarkdown> = {
  katex: (node) => {
    const text = String(node.attrs?.text ?? '').trim();
    return text ? `$${text}$` : '';
  },
  attachment: (node) => {
    const url = String(node.attrs?.url ?? '');
    const name = String(node.attrs?.fileName ?? url);
    return url ? `[${name}](${url})` : '';
  },
  twitter: (node) => {
    const src = String(node.attrs?.src ?? '');
    return src ? `[${src}](${src})` : '';
  },
  callout: (node) => {
    const type = String(node.attrs?.type ?? 'note').toLowerCase();
    const label = CALLOUT_LABELS[type] ?? 'NOTE';
    const lines = [`> [!${label}]`];
    const title = String(node.attrs?.title ?? '').trim();
    const body = String(node.attrs?.body ?? '').trim();

    if (title) lines.push(`> **${title}**`);
    if (title && body) lines.push('>');
    if (body) lines.push(...body.split('\n').map((line) => `> ${line}`));

    return lines.join('\n');
  },
  columns: joinBlocks,
  column: joinBlocks,
  tableOfContentsNode: () => '[TOC]',
  subscript: (node, h) => `<sub>${h.renderChildren(node)}</sub>`,
  superscript: (node, h) => `<sup>${h.renderChildren(node)}</sup>`,
  // Tiptap serializes details as `:::details` directives; plain <details> HTML
  // is understood by far more markdown renderers (GitHub, GitLab, VS Code...).
  details: (node, h) => {
    const summary = node.content?.find((child) => child.type === 'detailsSummary');
    const content = node.content?.find((child) => child.type === 'detailsContent');
    const open = node.attrs?.open ? ' open' : '';
    const summaryMarkdown = summary?.content ? h.renderChildren(summary.content) : '';
    const contentMarkdown = content?.content ? h.renderChildren(content.content, '\n\n') : '';

    return [
      `<details${open}>`,
      `<summary>${summaryMarkdown}</summary>`,
      '',
      contentMarkdown,
      '',
      '</details>',
    ].join('\n');
  },
  detailsSummary: (node, h) => (node.content ? h.renderChildren(node.content) : ''),
  detailsContent: joinBlocks,
};

function renderAsHtml(schema: Schema): RenderMarkdown {
  return (node) => {
    try {
      const pmNode = schema.nodeFromJSON(node);
      return getHTMLFromFragment(Fragment.from(pmNode), schema);
    } catch {
      return '';
    }
  };
}

function hasMarkdownSpec(extension: AnyExtension) {
  return typeof getExtensionField(extension, 'renderMarkdown') === 'function';
}

/**
 * Give every node and mark a markdown renderer without touching the editor's
 * own extensions: nodes listed in RENDERERS get a dedicated renderer, nodes
 * with their own spec keep it, and everything else is emitted as HTML so no
 * content is silently dropped.
 */
function withMarkdownSpecs(editor: Editor): AnyExtension[] {
  const htmlFallback = renderAsHtml(editor.schema);

  return editor.extensionManager.extensions.map((extension) => {
    if (extension.type === 'extension') {
      return extension;
    }

    let renderMarkdown = RENDERERS[extension.name];

    if (!renderMarkdown && !hasMarkdownSpec(extension) && extension.type === 'node') {
      renderMarkdown = htmlFallback;
    }

    if (!renderMarkdown) {
      return extension;
    }

    return (extension as AnyExtension & { extend: (config: NodeConfig) => AnyExtension }).extend({
      renderMarkdown,
    });
  });
}

export interface CreateMarkdownOptions {
  indentation?: { style?: 'space' | 'tab'; size?: number };
}

export function createMarkdown(editor: Editor, options: CreateMarkdownOptions = {}) {
  const manager = new MarkdownManager({
    extensions: withMarkdownSpecs(editor),
    indentation: options.indentation,
  });

  return manager.serialize(editor.getJSON());
}
