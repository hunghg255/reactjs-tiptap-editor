import { NodeViewWrapper } from '@tiptap/react';

import {
  scrollToTableOfContentsItem,
  useTableOfContents,
} from '@/extensions/TableOfContents/components/useTableOfContents';
import { cn } from '@/lib/utils';
import { useLocale } from '@/locales';

import type { TableOfContentsItem } from '@/extensions/TableOfContents/components/useTableOfContents';
import type { NodeViewProps } from '@tiptap/react';
import type { CSSProperties } from 'react';

// Walk back through parent headings to produce "1.2.3" style labels.
function buildIndexLabel(items: TableOfContentsItem[], index: number) {
  const parts: number[] = [items[index].itemIndex];
  let level = items[index].level;

  for (let i = index - 1; i >= 0 && level > 1; i -= 1) {
    if (items[i].level < level) {
      parts.unshift(items[i].itemIndex);
      level = items[i].level;
    }
  }

  return parts.join('.');
}

export function NodeViewTableOfContents({ editor, selected }: NodeViewProps) {
  const { t } = useLocale();
  const items = useTableOfContents(editor);

  return (
    <NodeViewWrapper
      className={cn('table-of-contents', { 'is-selected': selected })}
      contentEditable={false}
      data-type='table-of-contents'
    >
      <p className='table-of-contents__title'>{t('editor.tableofcontents.title')}</p>

      {items.length === 0 ? (
        <p className='table-of-contents__empty'>{t('editor.tableofcontents.empty')}</p>
      ) : (
        <ul className='table-of-contents__list'>
          {items.map((item, index) => (
            <li
              className='table-of-contents__item'
              key={item.id ?? `${item.pos}`}
              style={{ '--toc-level': item.level } as CSSProperties}
            >
              <button
                className={cn('table-of-contents__link', {
                  'is-active': item.isActive,
                })}
                onClick={() => scrollToTableOfContentsItem(editor, item)}
                type='button'
              >
                <span className='table-of-contents__index'>{buildIndexLabel(items, index)}</span>

                <span className='table-of-contents__text'>{item.textContent}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </NodeViewWrapper>
  );
}
