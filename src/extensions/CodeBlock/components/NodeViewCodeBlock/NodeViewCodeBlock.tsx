import React, { useCallback, useMemo, useRef } from 'react';

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { Copy, CopyCheck } from 'lucide-react';

import { IconComponent } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_LANGUAGE_CODE_BLOCK } from '@/constants';
import { CodeBlock } from '@/extensions';
import useCopy from '@/hooks/useCopy';
import { useEditableEditor } from '@/store/editableEditor';
import { deleteNode } from '@/utils/delete-node';

import styles from './index.module.scss';

export function NodeViewCodeBlock({ editor, node: { attrs }, updateAttributes, extension }: any) {
  const { isCopied, copyToClipboard } = useCopy();

  const listLang = useMemo(() => {
    return extension.options.languages?.length ? extension.options.languages : DEFAULT_LANGUAGE_CODE_BLOCK;
  }, [extension.options.languages]);

  const isEditable = useEditableEditor();

  const isPrint = editor?.options?.editorProps?.print;
  const { language: defaultLanguage } = attrs;
  const $container: any = useRef<HTMLPreElement>(null);

  const deleteMe = useCallback(() => deleteNode(CodeBlock.name, editor), [editor]);

  return (
    <NodeViewWrapper className={clsx(styles.wrap, !isPrint && styles.maxHeight, 'render-wrapper')}>

      <div className={clsx(styles.blockInfo, {
        [styles.blockInfoEditable]: !isEditable,
      })}

      >
        <span
          className={clsx(styles.btnCopy, isCopied && styles.copied)}
          onClick={() => copyToClipboard($container.current.innerText)}
        >
          {!isCopied ? <Copy size={16} /> : <CopyCheck size={16} />}
        </span>

        <span
          className={styles.btnDelete}
          onClick={deleteMe}
        >
          <IconComponent
            name="Trash2"
          />
        </span>

        <div className={styles.selectLang}>
          <Select
            defaultValue={defaultLanguage || 'auto'}
            disabled={!isEditable}
            onValueChange={value => updateAttributes({ language: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>

            <SelectContent className="richtext-max-h-60 richtext-overflow-y-auto">
              <SelectItem value="auto">
                Auto
              </SelectItem>

              {listLang.map((lang: any, index: any) => (
                <SelectItem key={`code-lang-${index}`}
                  value={lang}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>

      <pre ref={$container}>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
