import React, { useEffect, useState } from 'react';

import { ActionButton, Button, IconComponent, Input, Label, Popover, PopoverContent, PopoverTrigger, Switch } from '@/components';
import { useLocale } from '@/locales';

function SearchAndReplaceButton({ editor, ...props }: any) {
  const { t } = useLocale();

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

  const updateSearchReplace = (clearIndex = false) => {
    if (!editor) return;

    if (clearIndex) editor.commands.resetIndex();

    editor.commands.setSearchTerm(searchTerm);
    editor.commands.setReplaceTerm(replaceTerm);
    editor.commands.setCaseSensitive(caseSensitive);

    updateResult();
  };

  const goToSelection = () => {
    if (!editor) return;

    const { results, resultIndex } = editor.storage.searchAndReplace;
    const position: Range = results[resultIndex];

    if (!position) return;

    editor.commands.setTextSelection(position);

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
    editor?.commands.replace();
    goToSelection();
  };

  const next = () => {
    editor?.commands.nextSearchResult();
    goToSelection();
  };

  const previous = () => {
    editor?.commands.previousSearchResult();
    goToSelection();
  };

  const clear = () => {
    setSearchTerm('');
    setReplaceTerm('');

    editor.commands.resetIndex();
    updateResult();
  };

  const replaceAll = () => {
    editor?.commands.replaceAll();
    setResult('0/0');
  };

  return (
    <Popover
      onOpenChange={setVisible}
      open={visible}
    >
      <PopoverTrigger
        asChild
        disabled={props?.disabled}
      >
        <ActionButton
          disabled={props?.disabled}
          isActive={props?.isActive}
          tooltip={props?.tooltip}
          tooltipOptions={props?.tooltipOptions}
        >
          <IconComponent name={props?.icon} />
        </ActionButton>
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

        <div className="richtext-mb-[10px] richtext-flex richtext-items-center richtext-space-x-2">
          <Switch
            checked={caseSensitive}
            onCheckedChange={(e: any) => {
              setCaseSensitive(e);
              editor.commands.setCaseSensitive(e);
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

export default SearchAndReplaceButton;
