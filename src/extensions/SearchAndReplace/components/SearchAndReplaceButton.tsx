import React, { useEffect, useState } from 'react'
import deepEqual from 'deep-equal'
import { ActionButton, Button, IconComponent, Input, Label, Popover, PopoverContent, PopoverTrigger } from '@/components'
import { useLocale } from '@/locales'
import { ON_SEARCH_RESULTS, SearchAndReplace } from '@/extensions/SearchAndReplace/SearchAndReplace'

function SearchAndReplaceButton({ editor, ...props }: any) {
  const { t } = useLocale()

  const [currentIndex, setCurrentIndex] = useState(-1)
  const [results, setResults] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [replaceValue, setReplaceValue] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!visible) {
      setSearchValue('')
      setReplaceValue('')
      setCurrentIndex(-1)
      setResults([])

      editor.commands.setSearchTerm('')
      editor.commands.setReplaceTerm('')
    }
  }, [editor, visible])

  useEffect(() => {
    if (!visible)
      return
    if (editor && editor.commands && editor.commands.setSearchTerm) {
      editor.commands.setSearchTerm(searchValue)
    }
  }, [visible, searchValue, editor])

  useEffect(() => {
    if (!visible)
      return
    if (editor && editor.commands && editor.commands.setReplaceTerm) {
      editor.commands.setReplaceTerm(replaceValue)
    }
  }, [visible, replaceValue, editor])

  useEffect(() => {
    if (!editor)
      return

    const searchExtension = editor.extensionManager.extensions.find((ext: any) => ext.name === SearchAndReplace.name)

    if (!searchExtension)
      return

    const listener = () => {
      if (!visible)
        return

      const currentIndex = searchExtension ? searchExtension.storage.currentIndex : -1
      const results = searchExtension ? searchExtension.storage.results : []
      setCurrentIndex(preIndex => (preIndex !== currentIndex ? currentIndex : preIndex))
      setResults(prevResults => (deepEqual(prevResults, results) ? prevResults : results))
    }

    window.addEventListener(ON_SEARCH_RESULTS, listener)

    return () => {
      if (!searchExtension)
        return
      window.removeEventListener(ON_SEARCH_RESULTS, listener)
    }
  }, [visible, editor])

  return (
    <Popover
      open={visible}
      onOpenChange={setVisible}
    >
      <PopoverTrigger
        disabled={props?.disabled}
        asChild
      >
        <ActionButton
          tooltip={props?.tooltip}
          isActive={props?.isActive}
          disabled={props?.disabled}
        >
          <IconComponent name={props?.icon} />
        </ActionButton>
      </PopoverTrigger>
      <PopoverContent
        hideWhenDetached
        className="w-full"
        align="start"
        side="bottom"
      >
        <div className="p-2 bg-white border rounded-lg shadow-sm dark:bg-black border-neutral-200 dark:border-neutral-800">
          <div className="mb-[6px flex items-center justify-between">
            <Label>
              {t('editor.search.dialog.text')}
            </Label>
            <span className="font-semibold">
              {results.length ? `${currentIndex + 1}/${results.length}` : '0/0'}
            </span>
          </div>
          <div className="flex w-full max-w-sm items-center gap-1.5 mb-[10px]">
            <Input
              type="text"
              required
              className="w-full"
              placeholder="Text"
              autoFocus
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
          <Label className="mb-[6px]">
            {t('editor.replace.dialog.text')}
          </Label>
          <div className="flex w-full max-w-sm items-center gap-1.5 mb-[16px]">
            <div className="relative items-center w-full max-w-sm">
              <Input
                type="text"
                required
                className="w-80"
                placeholder="Text"
                value={replaceValue}
                onChange={e => setReplaceValue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-[10px] mb-[10px]">
            <Button disabled={!results.length} className="flex-1" onClick={editor.commands.goToPrevSearchResult}>
              {t('editor.previous.dialog.text')}
            </Button>

            <Button disabled={!results.length} className="flex-1" onClick={editor.commands.goToNextSearchResult}>
              {t('editor.next.dialog.text')}
            </Button>
          </div>

          <div className="flex items-center gap-[10px]">
            <Button disabled={!results.length} className="flex-1" onClick={editor.commands.replace}>
              {t('editor.replace.dialog.text')}
            </Button>

            <Button disabled={!results.length} className="flex-1" onClick={editor.commands.replaceAll}>
              {t('editor.replaceAll.dialog.text')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SearchAndReplaceButton
