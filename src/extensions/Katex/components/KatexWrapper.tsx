import { NodeViewWrapper } from '@tiptap/react';

import { KatexPreview } from './KatexPreview';

import type { NodeViewProps } from '@tiptap/react';

function decode(value: unknown) {
  const text = typeof value === 'string' ? value : '';
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

export function KatexNodeView({ node, extension }: NodeViewProps) {
  const text = decode(node.attrs.text);
  const macros = decode(node.attrs.macros);
  return (
    <NodeViewWrapper as='span' style={{ display: 'inline-block' }}>
      {text.trim() ? (
        <KatexPreview text={text} macros={macros} loader={extension.options.loadKatex} />
      ) : (
        <span contentEditable={false}>Not enter a formula</span>
      )}
    </NodeViewWrapper>
  );
}
