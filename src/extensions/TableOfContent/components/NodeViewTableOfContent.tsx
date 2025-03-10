/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useState } from 'react';

import { NodeViewWrapper } from '@tiptap/react';
import cls from 'clsx';

import { useLocale } from '@/locales';
import { useEditableEditor } from '@/store/editableEditor';

import styles from './index.module.scss';

function arrToTree(tocs: any) {
  const result = [] as any;
  const levels = [result];

  tocs.forEach((o: any) => {
    let offset = -1;
    let parent = levels[o.level + offset];

    while (!parent) {
      offset -= 1;
      parent = levels[o.level + offset];
    }

    parent.push({ ...o, children: (levels[o.level] = []) });
  });

  return result;
}

export function NodeViewTableOfContent({ editor }: any) {
  const isEditable = useEditableEditor();
  const [items, setItems] = useState([]);
  const { t } = useLocale();

  const handleUpdate = useCallback(() => {
    const headings = [] as any;
    const transaction = editor.state.tr;

    editor.state.doc.descendants((node: any, pos: any) => {
      if (node.type.name === 'heading') {
        const id = `heading-${headings.length + 1}`;

        if (node.attrs.id !== id) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id,
          });
        }

        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id,
        });
      }
    });

    transaction.setMeta('addToHistory', false);
    transaction.setMeta('preventUpdate', true);
    editor.view.dispatch(transaction);

    setItems(headings);
    editor.eventEmitter && editor.eventEmitter.emit('TableOfContents', arrToTree(headings));
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (!editor.options.editable) {
      handleUpdate();
      return;
    }

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, handleUpdate]);

  useEffect(() => {
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NodeViewWrapper className={cls('tableOfContent', styles.toc, isEditable && styles.visible)}>
      {isEditable
        ? (
          <div style={{ position: 'relative' }}>
            <p className="text-[20px] richtext-mb-[8px] richtext-font-semibold">
              {t('editor.table_of_content')}
            </p>

            <ul className={styles.list}>
              {items.map((item: any, index) => (
                <li className={styles.item}
                  key={`table-of-content-${index}`}
                  style={{ paddingLeft: `${item.level - 1}rem` }}
                >
                  <a href={`#${item.id}`}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
        : null}
    </NodeViewWrapper>
  );
}
