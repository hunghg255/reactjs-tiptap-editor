import React, { useEffect, useState } from 'react';

import deepEqual from 'deep-equal';

import { ActionButton, Button, IconComponent, Input, Label, Popover, PopoverContent, PopoverTrigger, Switch } from '@/components';
import {  SearchAndReplace } from '@/extensions/SearchAndReplace/SearchAndReplace';
import { useLocale } from '@/locales';
import { listenEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

function SearchAndReplaceButton({ editor, ...props }: any) {
  const { t } = useLocale();

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSearchValue('');
      setReplaceValue('');
      setCurrentIndex(-1);
      setResults([]);

      editor.commands.setSearchTerm('');
      editor.commands.setReplaceTerm('');
    }
  }, [editor, visible]);

  useEffect(() => {
    if (!visible)
      return;
    if (editor && editor.commands && editor.commands.setSearchTerm) {
      editor.commands.setSearchTerm(searchValue);
    }
  }, [visible, searchValue, editor]);

  useEffect(() => {
    if (!visible)
      return;
    if (editor && editor.commands && editor.commands.setReplaceTerm) {
      editor.commands.setReplaceTerm(replaceValue);
    }
  }, [visible, replaceValue, editor]);

  useEffect(() => {
    if (!editor)
      return;

    const searchExtension = editor.extensionManager.extensions.find((ext: any) => ext.name === SearchAndReplace.name);

    if (!searchExtension)
      return;

    const listener = () => {
      if (!visible)
        return;

      const currentIndex = searchExtension ? searchExtension.storage.currentIndex : -1;
      const results = searchExtension ? searchExtension.storage.results : [];
      setCurrentIndex(preIndex => (preIndex !== currentIndex ? currentIndex : preIndex));
      setResults(prevResults => (deepEqual(prevResults, results) ? prevResults : results));
    };

    listenEvent(EVENTS.SEARCH_REPLCE, listener);

    return () => {
      if (!searchExtension)
        return;
      listenEvent(EVENTS.SEARCH_REPLCE, listener);
    };
  }, [visible, editor]);

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
            {results.length > 0 ? `${currentIndex + 1}/${results.length}` : '0/0'}
          </span>
        </div>

        <div className="richtext-mb-[10px] richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <Input
            autoFocus
            className="richtext-w-full"
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Text"
            required
            type="text"
            value={searchValue}
          />

          <Button className="richtext-flex-1"
            disabled={results.length === 0}
            onClick={editor.commands.goToPrevSearchResult}
          >
            <IconComponent name="ChevronUp" />
          </Button>

          <Button className="richtext-flex-1"
            disabled={results.length === 0}
            onClick={editor.commands.goToNextSearchResult}
          >
            <IconComponent name="ChevronDown" />
          </Button>

        </div>

        <Label className="richtext-mb-[6px]">
          {t('editor.replace.dialog.text')}
        </Label>

        <div className="richtext-mb-[5px] richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
            <Input
              className="richtext-w-80"
              onChange={e => setReplaceValue(e.target.value)}
              placeholder="Text"
              required
              type="text"
              value={replaceValue}
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
            disabled={results.length === 0}
            onClick={editor.commands.replace}
          >
            {t('editor.replace.dialog.text')}
          </Button>

          <Button className="richtext-flex-1"
            disabled={results.length === 0}
            onClick={editor.commands.replaceAll}
          >
            {t('editor.replaceAll.dialog.text')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SearchAndReplaceButton;
