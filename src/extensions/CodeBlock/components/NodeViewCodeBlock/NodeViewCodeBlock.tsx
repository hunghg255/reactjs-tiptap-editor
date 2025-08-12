import React, { useCallback, useEffect, useRef } from 'react';

import { NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconComponent } from '@/components';

import 'prism-code-editor-lightweight/prism/languages/bash';
import 'prism-code-editor-lightweight/prism/languages/css';
import 'prism-code-editor-lightweight/prism/languages/css-extras';
import 'prism-code-editor-lightweight/prism/languages/ini';
import 'prism-code-editor-lightweight/prism/languages/kotlin';
import 'prism-code-editor-lightweight/prism/languages/xml';
import 'prism-code-editor-lightweight/prism/languages/markup';
import 'prism-code-editor-lightweight/prism/languages/r';
import 'prism-code-editor-lightweight/prism/languages/basic';
import 'prism-code-editor-lightweight/prism/languages/vbnet';
import 'prism-code-editor-lightweight/prism/languages/c';
import 'prism-code-editor-lightweight/prism/languages/opencl';
import 'prism-code-editor-lightweight/prism/languages/diff';
import 'prism-code-editor-lightweight/prism/languages/java';
import 'prism-code-editor-lightweight/prism/languages/less';
import 'prism-code-editor-lightweight/prism/languages/objectivec';
import 'prism-code-editor-lightweight/prism/languages/ruby';
import 'prism-code-editor-lightweight/prism/languages/sql';
import 'prism-code-editor-lightweight/prism/languages/wasm';
import 'prism-code-editor-lightweight/prism/languages/cpp';
import 'prism-code-editor-lightweight/prism/languages/go';
import 'prism-code-editor-lightweight/prism/languages/javascript';
import 'prism-code-editor-lightweight/prism/languages/js-templates';
import 'prism-code-editor-lightweight/prism/languages/jsx';
import 'prism-code-editor-lightweight/prism/languages/lua';
import 'prism-code-editor-lightweight/prism/languages/perl';
import 'prism-code-editor-lightweight/prism/languages/python';
import 'prism-code-editor-lightweight/prism/languages/rust';
import 'prism-code-editor-lightweight/prism/languages/swift';
import 'prism-code-editor-lightweight/prism/languages/clike';
import 'prism-code-editor-lightweight/prism/languages/csharp';
import 'prism-code-editor-lightweight/prism/languages/graphql';
import 'prism-code-editor-lightweight/prism/languages/json';
import 'prism-code-editor-lightweight/prism/languages/makefile';
import 'prism-code-editor-lightweight/prism/languages/scss';
import 'prism-code-editor-lightweight/prism/languages/typescript';
import 'prism-code-editor-lightweight/prism/languages/tsx';
import 'prism-code-editor-lightweight/prism/languages/yaml';
import 'prism-code-editor-lightweight/prism/languages/regex';
import 'prism-code-editor-lightweight/prism/languages/php';
import 'prism-code-editor-lightweight/prism/languages/markdown';

import { createEditor, type PrismEditor } from 'prism-code-editor-lightweight';
import { defaultCommands, editHistory } from 'prism-code-editor-lightweight/commands';
import { cursorPosition } from 'prism-code-editor-lightweight/cursor';
import { indentGuides } from 'prism-code-editor-lightweight/guides';
import { highlightBracketPairs } from 'prism-code-editor-lightweight/highlight-brackets';
import { matchBrackets } from 'prism-code-editor-lightweight/match-brackets';
import { matchTags } from 'prism-code-editor-lightweight/match-tags';

import { useEditableEditor } from '@/store/editableEditor';
import { deleteNode } from '@/utils/delete-node';

import styles from './index.module.scss';
import { CodeBlock } from '../../CodeBlock';

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

  const deleteMe = useCallback(() => deleteNode(CodeBlock.name, props?.editor), [props?.editor]);

  const codeEditor = useRef<PrismEditor | null>(null);
  const code = props.node.attrs.code || props.node.textContent || '';

  const focusEditor = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTimeout(() => {
      codeEditor.current?.textarea?.focus?.();
    }, 0);
  }, []);

  const copyCode = async () => {
    if (!code) return;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        console.log('Copy Success');
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        // TODO execCommand is deprecated. Clipboard-polyfill can be used to solve compatibility issues
        document.execCommand('copy');
        document.body.removeChild(textarea);
        console.log('Copy Success (fallback)');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      focusEditor();
    }
  };

  const toggleLineNumbers = () => {
    props.updateAttributes({
      lineNumbers: !props.node.attrs.lineNumbers,
    });
    focusEditor();
  };

  const toggleWordWrap = () => {
    props.updateAttributes({
      wordWrap: !props.node.attrs.wordWrap,
    });
    focusEditor();
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

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    focusEditor(e);
  }, [focusEditor]);

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
          queueMicrotask(() => {
            props.updateAttributes({ code: value });
          });
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
          focusEditor();
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
    if (codeEditor.current?.setOptions) {
      const attrs = validateAndUpdateLanguage(props.node.attrs);

      codeEditor.current?.setOptions(attrs);
    }
  }, [codeEditor, props.node.attrs]);

  return (
    <NodeViewWrapper className={clsx(styles.wrap, 'render-wrapper')}>
      <div
        onClick={handleContainerClick}
        ref={containerRef}
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
                focusEditor();
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
                focusEditor();
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
