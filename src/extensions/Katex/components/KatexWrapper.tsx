import { useMemo } from 'react';

import { NodeViewWrapper } from '@tiptap/react';
import katex from 'katex';

export function KatexNodeView({ node }: any) {
  const { text } = node.attrs;

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${text}`);
    } catch {
      return text;
    }
  }, [text]);

  const content = useMemo(
    () =>
      text.trim()
        ? (
          <span contentEditable={false}
dangerouslySetInnerHTML={{ __html: formatText }}
          >
          </span>
        )
        : (
          <span contentEditable={false}>
            Not enter a formula
          </span>
        ),
    [text, formatText],
  );

  return (
    <NodeViewWrapper
      as="span"
      style={{
        display: 'inline-block',
      }}
    >
      {content}
    </NodeViewWrapper>
  );
}
