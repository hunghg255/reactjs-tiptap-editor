/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef } from 'react';

import { NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconComponent } from '@/components';

import 'prism-code-editor/prism/languages/bash';
import 'prism-code-editor/prism/languages/css';
import 'prism-code-editor/prism/languages/css-extras';
import 'prism-code-editor/prism/languages/ini';
import 'prism-code-editor/prism/languages/kotlin';
import 'prism-code-editor/prism/languages/xml';
import 'prism-code-editor/prism/languages/markup';
import 'prism-code-editor/prism/languages/r';
import 'prism-code-editor/prism/languages/basic';
import 'prism-code-editor/prism/languages/vbnet';
import 'prism-code-editor/prism/languages/c';
import 'prism-code-editor/prism/languages/opencl';
import 'prism-code-editor/prism/languages/diff';
import 'prism-code-editor/prism/languages/java';
import 'prism-code-editor/prism/languages/less';
import 'prism-code-editor/prism/languages/objectivec';
import 'prism-code-editor/prism/languages/ruby';
import 'prism-code-editor/prism/languages/sql';
import 'prism-code-editor/prism/languages/wasm';
import 'prism-code-editor/prism/languages/cpp';
import 'prism-code-editor/prism/languages/go';
import 'prism-code-editor/prism/languages/javascript';
import 'prism-code-editor/prism/languages/js-templates';
import 'prism-code-editor/prism/languages/jsx';
import 'prism-code-editor/prism/languages/lua';
import 'prism-code-editor/prism/languages/perl';
import 'prism-code-editor/prism/languages/python';
import 'prism-code-editor/prism/languages/rust';
import 'prism-code-editor/prism/languages/swift';
import 'prism-code-editor/prism/languages/clike';
import 'prism-code-editor/prism/languages/csharp';
import 'prism-code-editor/prism/languages/graphql';
import 'prism-code-editor/prism/languages/json';
import 'prism-code-editor/prism/languages/makefile';
import 'prism-code-editor/prism/languages/scss';
import 'prism-code-editor/prism/languages/typescript';
import 'prism-code-editor/prism/languages/tsx';
import 'prism-code-editor/prism/languages/yaml';
import 'prism-code-editor/prism/languages/regex';
import 'prism-code-editor/layout.css';

import { createEditor, type PrismEditor } from 'prism-code-editor';
import { defaultCommands, editHistory } from 'prism-code-editor/commands';
import { cursorPosition } from 'prism-code-editor/cursor';
import { indentGuides } from 'prism-code-editor/guides';
import { highlightBracketPairs } from 'prism-code-editor/highlight-brackets';
import { matchBrackets } from 'prism-code-editor/match-brackets';
import { matchTags } from 'prism-code-editor/match-tags';

import { CodeBlock } from '@/extension-bundle';
import { useEditableEditor } from '@/store/editableEditor';
import { deleteNode } from '@/utils/delete-node';

import styles from './index.module.scss';

const languages = [
  { value: 'plaintext', label: 'plaintext' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'php', label: 'PHP' },
];

const tabSizes = [2, 4, 8];

export function NodeViewCodeBlock(props: any) {
  const isEditable = useEditableEditor();

  const containerRef: any = useRef<HTMLPreElement>(null);

  const deleteMe = useCallback(() => deleteNode(CodeBlock.name, props?.editor), [props?.edito]);

  const codeEditor = useRef<PrismEditor | null>(null);
  const code = props.node.attrs.code || props.node.textContent || '';

  const copyCode = () => {
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          console.log('Copy Success');
        })
        .catch(err => {
          console.error('Error:', err);
        });
    }
  };

  const toggleLineNumbers = () => {
    props.updateAttributes({
      lineNumbers: !props.node.attrs.lineNumbers,
    });
  };

  const toggleWordWrap = () => {
    props.updateAttributes({
      wordWrap: !props.node.attrs.wordWrap,
    });
  };

  const validateAndUpdateLanguage = (attrs: any) => {
    const validatedAttrs = { ...attrs };
    if (validatedAttrs.language && !languages.some(lang => lang.value === validatedAttrs.language)) {
      validatedAttrs.language = 'plaintext';
      props.updateAttributes({
        language: 'plaintext',
      });
    }
    return validatedAttrs;
  };

  useEffect(() => {
    if (containerRef.current) {
      const attrs = validateAndUpdateLanguage(props.node.attrs);
      codeEditor.current = createEditor(containerRef.current, {
        readOnly: !props.editor.isEditable,
        language: attrs.language || 'plaintext',
        tabSize: attrs.tabSize ?? 2,
        lineNumbers: attrs.lineNumbers ?? true,
        wordWrap: attrs.wordWrap ?? false,
        value: code,
        rtl: false,
        onUpdate(value) {
          props.updateAttributes({ code: value });
        },
      });
      codeEditor.current.addExtensions(
        matchBrackets(),
        matchTags(),
        indentGuides(),
        highlightBracketPairs(),
        cursorPosition(),
        defaultCommands(),
        editHistory()
      );

      if (props.node.attrs.shouldFocus) {
        setTimeout(() => {
          codeEditor.current?.textarea.focus();
          props.updateAttributes({
            shouldFocus: false,
          });
        }, 0);
      }
    }

    return () => {
      if (codeEditor.current?.remove) codeEditor.current?.remove();
    };
  }, [containerRef]);

  useEffect(() => {
    //@ts-expect-error
    if (codeEditor.current?.setOption) {
      codeEditor.current?.setOptions({
        readOnly: props.editor.isEditable,
      });
    }

  }, [codeEditor, props.editor.isEditable]);

  useEffect(() => {
    //@ts-expect-error
    if (codeEditor.current?.setOption) {
      const attrs = validateAndUpdateLanguage(props.node.attrs);
      codeEditor.current?.setOptions(attrs);
    }
  }, [codeEditor, props.node.attrs.language, props.node.attrs.lineNumbers, props.node.attrs.wordWrap, props.node.attrs.tabSize, props.node.attrs]);

  return (
    <NodeViewWrapper className={clsx(styles.wrap, 'render-wrapper')}>
      <div ref={containerRef}
        className={clsx('richtext-node-container richtext-hover-shadow richtext-select-outline richtext-node-code-block !richtext-my-[10px]', {
          [styles.blockInfoEditable]: !isEditable,
        })}
      >
        <div className="richtext-code-block-toolbar">

          <div>
            <Select
              defaultValue={props.node.attrs.language}
              disabled={!isEditable}
              onValueChange={(value) => {
                props.updateAttributes({
                  language: value,
                });
              }}
            >
              <SelectTrigger className="richtext-h-7 richtext-w-[160px] richtext-border-none richtext-text-sm richtext-outline-none hover:richtext-bg-[#5a5d5e4f]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>

              <SelectContent
                className="richtext-border-[#3a3f4b] richtext-bg-[#21252b] richtext-text-[#ccc]"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {
                  languages?.map((lang) => {
                    return (
                      <SelectItem
                        className="focus:richtext-bg-[#5a5d5e4f] focus:richtext-text-white"
                        key={lang.value}
                        value={lang.value}
                      >
                        {lang.label}
                      </SelectItem>
                    );
                  }
                  )
                }
              </SelectContent>
            </Select>
          </div>

          <div className="toolbar-divider"></div>

          <div
            className="richtext-flex richtext-size-7 richtext-cursor-pointer richtext-items-center richtext-justify-center richtext-rounded-sm hover:richtext-bg-[#5a5d5e4f]"
            onClick={copyCode}
          >
            <IconComponent className="richtext-size-4"
              name="Copy"
            >
            </IconComponent>
          </div>

          <div className="toolbar-divider"></div>

          <div
            onClick={toggleLineNumbers}
            className={clsx('richtext-flex richtext-size-7 richtext-cursor-pointer richtext-items-center richtext-justify-center richtext-rounded-sm hover:richtext-bg-[#5a5d5e4f]', {
              'richtext-bg-[#5a5d5e4f]': props?.node.attrs.lineNumbers
            })}
          >
            <IconComponent className="richtext-size-4"
              name="List"
            >
            </IconComponent>
          </div>

          <div className="toolbar-divider"></div>

          <div
            onClick={toggleWordWrap}
            className={clsx('richtext-flex richtext-size-7 richtext-cursor-pointer richtext-items-center richtext-justify-center richtext-rounded-sm hover:richtext-bg-[#5a5d5e4f]', {
              'richtext-bg-[#5a5d5e4f]': props?.node.attrs.wordWrap
            })}
          >
            <IconComponent className="richtext-size-4"
              name="WrapText"
            >
            </IconComponent>
          </div>

          <div className="toolbar-divider"></div>

          <div>
            <Select
              defaultValue={props.node.attrs.tabSize}
              disabled={!isEditable}
              onValueChange={(value) => {
                props.updateAttributes({
                  tabSize: value,
                });
              }}
            >
              <SelectTrigger className="richtext-h-7 richtext-w-[60px] richtext-border-none richtext-text-sm richtext-outline-none hover:richtext-bg-[#5a5d5e4f]">
                <IconComponent className="richtext-size-4"
                  name="IndentIncrease"
                />
              </SelectTrigger>

              <SelectContent
                className="richtext-border-[#3a3f4b] richtext-bg-[#21252b] richtext-text-[#ccc]"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {
                  tabSizes?.map((size) => {
                    return (
                      <SelectItem
                        className="focus:richtext-bg-[#5a5d5e4f] focus:richtext-text-white"
                        key={size}
                        value={size as any}
                      >
                        {size}
                      </SelectItem>
                    );
                  })
                }
              </SelectContent>
            </Select>
          </div>

          <div className="toolbar-divider"></div>

          <div
            className="richtext-flex richtext-size-7 richtext-cursor-pointer richtext-items-center richtext-justify-center richtext-rounded-sm hover:richtext-bg-[#5a5d5e4f]"
            onClick={deleteMe}
          >
            <IconComponent className="richtext-size-4"
              name="Trash2"
            >
            </IconComponent>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
