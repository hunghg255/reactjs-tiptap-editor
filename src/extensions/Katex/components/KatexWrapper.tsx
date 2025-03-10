import { useMemo } from 'react';

import { NodeViewWrapper } from '@tiptap/react';

import katex from 'katex';
import { useTheme } from '@/theme/theme';
import { convertColorToRGBA } from '@/utils/color';

export function KatexWrapper({ node }: any) {
  const theme = useTheme();
  const { text } = node.attrs;

  const backgroundColor = useMemo(() => {
    const color = 'rgb(254, 242, 237)';
    if (theme === 'dark')
      return convertColorToRGBA(color, 0.75);
    return color;
  }, [theme]);

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
          <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText }}></span>
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
      style={{
        display: 'inline-block',
        backgroundColor,
      }}
      as="span"
    >
      {content}
    </NodeViewWrapper>
  );
}
