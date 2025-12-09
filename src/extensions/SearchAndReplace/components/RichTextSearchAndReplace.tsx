/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';

import { ActionButton, Button, IconComponent, Input, Label, Popover, PopoverContent, PopoverTrigger, Checkbox } from '@/components';
import { SearchAndReplace } from '@/extensions/SearchAndReplace/SearchAndReplace';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';

export function RichTextSearchAndReplace() {
  const { t } = useLocale();

  const editor = useEditorInstance();
  const buttonProps = useButtonProps(SearchAndReplace.name);

  const {
    icon = undefined,
    tooltip = undefined,
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { disabled } = useActive(isActive);

  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [result, setResult] = useState('');

  const updateResult = () => {
    setResult(`${editor?.storage?.searchAndReplace?.resultIndex + 1}/${editor?.storage?.searchAndReplace?.results.length}`);
  };

  useEffect(() => {
    if (editor) {
      updateResult();
    }
  }, [editor]);

  const onAction = () => {
    if (disabled) return;

    if (action) action();
  };

  const updateSearchReplace = (clearIndex = false) => {
    if (!editor) return;

    if (clearIndex) editor?.commands?.resetIndex?.();

    editor?.commands?.setSearchTerm?.(searchTerm);
    editor?.commands?.setReplaceTerm?.(replaceTerm);
    editor?.commands?.setCaseSensitive?.(caseSensitive);

    updateResult();
  };

  const goToSelection = () => {
    if (!editor) return;

    const { results, resultIndex } = editor.storage.searchAndReplace;
    //@ts-expect-error
    const position: Range = results[resultIndex];

    if (!position) return;
    //@ts-expect-error
    editor?.commands?.setTextSelection?.(position);

    const { node } = editor.view.domAtPos(
      editor.state.selection.anchor
    );
    if (node instanceof HTMLElement) node.scrollIntoView({ behavior: 'smooth', block: 'center' });

    updateResult();

  };

  useEffect(() => {
    if (!searchTerm.trim()) clear();
    if (searchTerm.trim()) updateSearchReplace(true);

  }, [searchTerm]);

  useEffect(() => {
    if (replaceTerm.trim()) updateSearchReplace();
  }, [replaceTerm]);

  useEffect(() => {
    updateSearchReplace(true);
  }, [caseSensitive]);

  const replace = () => {
    editor?.commands?.replace?.();
    goToSelection();
  };

  const next = () => {
    editor?.commands?.nextSearchResult?.();
    goToSelection();
  };

  const previous = () => {
    editor?.commands?.previousSearchResult?.();
    goToSelection();
  };

  const clear = () => {
    setSearchTerm('');
    setReplaceTerm('');

    editor?.commands?.resetIndex?.();
    updateResult();
  };

  const replaceAll = () => {
    editor?.commands?.replaceAll?.();
    setResult('0/0');
  };

  if (!buttonProps) {
    return <></>;
  }

  return (
    <Popover
      onOpenChange={setVisible}
      open={visible}
    >
      <PopoverTrigger
        asChild
        disabled={disabled}
      >
        <ActionButton
          action={onAction}
          disabled={disabled}
          icon={icon}
          shortcutKeys={shortcutKeys}
          tooltip={tooltip}
          tooltipOptions={tooltipOptions}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="richtext-w-full"
        hideWhenDetached
        side="bottom"
      >

        <div className="richtext-mb-[6px] richtext-flex richtext-items-center richtext-justify-between">
          <Label>
            {t('editor.search.dialog.text')}
          </Label>

          <span className="richtext-font-semibold">
            {result}
          </span>
        </div>

        <div className="richtext-mb-[10px] richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <Input
            autoFocus
            className="richtext-w-full"
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Text"
            required
            type="text"
            value={searchTerm}
          />

          <Button className="richtext-flex-1"
            onClick={previous}
          >
            <IconComponent name="ChevronUp" />
          </Button>

          <Button className="richtext-flex-1"
            onClick={next}
          >
            <IconComponent name="ChevronDown" />
          </Button>

          <Button className="richtext-flex-1"
            onClick={clear}
          >
            Clear
          </Button>

        </div>

        <Label className="richtext-mb-[6px]">
          {t('editor.replace.dialog.text')}
        </Label>

        <div className="richtext-mb-[5px] richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
            <Input
              className="richtext-w-80"
              onChange={e => setReplaceTerm(e.target.value)}
              placeholder="Text"
              required
              type="text"
              value={replaceTerm}
            />
          </div>
        </div>

        <div className="richtext-my-[10px]  richtext-flex richtext-items-center richtext-gap-1">
          <Checkbox
            checked={caseSensitive}
            onCheckedChange={(v) => {
              setCaseSensitive(v as boolean);
              editor.commands.setCaseSensitive(v as boolean);
            }}
          />

          <Label>
            {t('editor.replace.caseSensitive')}
          </Label>
        </div>

        <div className="richtext-flex richtext-items-center richtext-gap-[10px]">
          <Button className="richtext-flex-1"
            onClick={replace}
          >
            {t('editor.replace.dialog.text')}
          </Button>

          <Button className="richtext-flex-1"
            onClick={replaceAll}
          >
            {t('editor.replaceAll.dialog.text')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
