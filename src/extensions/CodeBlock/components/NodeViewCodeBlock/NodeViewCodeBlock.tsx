/* eslint-disable unicorn/prefer-dom-node-text-content */

import React, { useCallback, useMemo, useRef } from 'react'

import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

import { Copy, CopyCheck } from 'lucide-react'
import clsx from 'clsx'
import styles from './index.module.scss'
import { CodeBlock } from '@/extensions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useCopy from '@/hooks/useCopy'
import { deleteNode } from '@/utils/delete-node'
import { DEFAULT_LANGUAGE_CODE_BLOCK } from '@/constants'
import { IconComponent } from '@/components'
import { useEditableEditor } from '@/store/editableEditor'

export function NodeViewCodeBlock({ editor, node: { attrs }, updateAttributes, extension }: any) {
  const { isCopied, copyToClipboard } = useCopy()

  const listLang = useMemo(() => {
    return extension.options.languages?.length ? extension.options.languages : DEFAULT_LANGUAGE_CODE_BLOCK
  }, [extension.options.languages])

  const isEditable = useEditableEditor()

  const isPrint = editor?.options?.editorProps?.print
  const { language: defaultLanguage } = attrs
  const $container: any = useRef<HTMLPreElement>()

  const deleteMe = useCallback(() => deleteNode(CodeBlock.name, editor), [editor])

  return (
    <NodeViewWrapper className={clsx(styles.wrap, !isPrint && styles.maxHeight, 'render-wrapper')}>

      <div className={clsx(styles.blockInfo, {
        [styles.blockInfoEditable]: !isEditable,
      })}

      >
        <span
          onClick={() => copyToClipboard($container.current.innerText)}
          className={clsx(styles.btnCopy, isCopied && styles.copied)}
        >
          {!isCopied ? <Copy size={16} /> : <CopyCheck size={16} />}
        </span>

        <span
          onClick={deleteMe}
          className={styles.btnDelete}
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
              <SelectItem value="auto">Auto</SelectItem>

              {listLang.map((lang: any, index: any) => (
                <SelectItem key={`code-lang-${index}`} value={lang}>
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
  )
}
