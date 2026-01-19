import { NodeViewWrapper } from '@tiptap/react';
import katexLib from 'katex';
import { useMemo } from 'react';

import { safeJSONParse } from '@/utils/json';

export function KatexNodeView({ node }: any) {
  const { text, macros } = node.attrs;

  const formatText = useMemo(() => {
    try {
      return katexLib.renderToString(decodeURIComponent(text || ''), {
        macros: safeJSONParse(decodeURIComponent(macros || '')),
      });
    } catch {
      return text;
    }
  }, [text, macros]);

  const content = useMemo(
    () =>
      text.trim() ? (
        <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText }}></span>
      ) : (
        <span contentEditable={false}>Not enter a formula</span>
      ),
    [text, formatText]
  );

  return (
    <NodeViewWrapper
      as='span'
      style={{
        display: 'inline-block',
      }}
    >
      {content}
    </NodeViewWrapper>
  );
}
