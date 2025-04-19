/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Extension } from '@tiptap/core';
import type { EditorState } from '@tiptap/pm/state';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import scrollIntoView from 'scroll-into-view-if-needed';

import SearchAndReplaceButton from '@/extensions/SearchAndReplace/components/SearchAndReplaceButton';
import type { GeneralOptions } from '@/types';
import { dispatchEvent } from '@/utils/customEvents/customEvents';
import { EVENTS } from '@/utils/customEvents/events.constant';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    search: {
      setSearchTerm: (searchTerm: string) => ReturnType
      setReplaceTerm: (replaceTerm: string) => ReturnType
      replace: () => ReturnType
      replaceAll: () => ReturnType
      goToPrevSearchResult: () => void
      goToNextSearchResult: () => void
      setCaseSensitive: (caseSensitive: boolean) => ReturnType
    }
  }
}

interface Result {
  from: number
  to: number
}

interface TextNodesWithPosition {
  text: string
  pos: number
}

const updateView = (state: EditorState, dispatch: any) => dispatch(state.tr);

function regex(s: string, disableRegex: boolean, caseSensitive: boolean): RegExp {
  return RegExp(disableRegex ? s.replace(/[$()*+./?[\\\]^{|}-]/g, String.raw`\$&`) : s, caseSensitive ? 'gu' : 'gui');
}

function processSearches(
  doc: any,
  searchTerm: RegExp,
  searchResultClass: string,
): { decorationsToReturn: any[], results: Result[] } {
  const decorations: Decoration[] = [];
  let textNodesWithPosition: TextNodesWithPosition[] = [];
  const results: Result[] = [];

  let index = 0;

  if (!searchTerm)
    return { decorationsToReturn: [], results: [] };

  doc?.descendants((node: any, pos: any) => {
    if (node.isText) {
      if (textNodesWithPosition[index]) {
        textNodesWithPosition[index] = {
          text: textNodesWithPosition[index].text + node.text,
          pos: textNodesWithPosition[index].pos,
        };
      } else {
        textNodesWithPosition[index] = {
          text: `${node.text}`,
          pos,
        };
      }
    } else {
      index += 1;
    }
  });

  textNodesWithPosition = textNodesWithPosition.filter(Boolean);

  for (const { text, pos } of textNodesWithPosition) {

    const matches = [...text.matchAll(searchTerm)];

    for (const m of matches) {

      if (m[0] === '')
        break;

      if (m.index !== undefined) {
        results.push({
          from: pos + m.index,
          to: pos + m.index + m[0].length,
        });
      }
    }
  }

  for (const r of results) {
    decorations.push(Decoration.inline(r.from, r.to, { class: searchResultClass }));
  }

  return {
    decorationsToReturn: decorations,
    results,
  };
}

function replace(replaceTerm: string, results: Result[], { state, dispatch }: any) {
  const firstResult = results[0];

  if (!firstResult)
    return;

  const { from, to } = results[0];

  if (dispatch)
    dispatch(state.tr.insertText(replaceTerm, from, to));
}

function rebaseNextResult(replaceTerm: string, index: number, lastOffset: number, results: Result[]): [number, Result[]] | null {
  const nextIndex = index + 1;

  if (!results[nextIndex])
    return null;

  const { from: currentFrom, to: currentTo } = results[index];

  const offset = currentTo - currentFrom - replaceTerm.length + lastOffset;

  const { from, to } = results[nextIndex];

  results[nextIndex] = {
    to: to - offset,
    from: from - offset,
  };

  return [offset, results];
}

function replaceAll(replaceTerm: string, results: Result[], { tr, dispatch }: any) {
  let offset = 0;

  let ourResults = results.slice();

  if (ourResults.length === 0)
    return false;

  for (let i = 0; i < ourResults.length; i += 1) {
    const { from, to } = ourResults[i];

    tr.insertText(replaceTerm, from, to);

    const rebaseNextResultResponse = rebaseNextResult(replaceTerm, i, offset, ourResults);

    if (rebaseNextResultResponse) {
      offset = rebaseNextResultResponse[0];
      ourResults = rebaseNextResultResponse[1];
    }
  }

  dispatch(tr);

  return true;
}

function gotoSearchResult({ view, tr, searchResults, searchResultCurrentClass, gotoIndex }: any) {
  const result = searchResults[gotoIndex];

  if (result) {
    const transaction = tr.setMeta('directDecoration', {
      fromPos: result.from,
      toPos: result.to,
      attrs: { class: searchResultCurrentClass },
    });
    view?.dispatch(transaction);

    setTimeout(() => {
      const el = window.document.querySelector(`.${searchResultCurrentClass}`);
      if (el) {
        scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' });
      }
    }, 0);

    return true;
  }

  return false;
}

interface SearchOptions extends GeneralOptions<SearchOptions> {
  searchTerm: string
  replaceTerm: string
  searchResultClass: string
  searchResultCurrentClass: string
  caseSensitive: boolean
  disableRegex: boolean
  onChange?: () => void
}

interface SearchStorage {
  results: Result[]
  currentIndex: number
}

export const SearchAndReplace = /* @__PURE__ */ Extension.create<SearchOptions, SearchStorage>({
  name: 'search',

  addOptions() {
    return {
      ...this.parent?.(),
      searchTerm: '',
      replaceTerm: '',
      results: [],
      currentIndex: 0,
      searchResultClass: 'search-result',
      searchResultCurrentClass: 'search-result-current',
      caseSensitive: false,
      disableRegex: false,
      onChange: () => {
        return;
      },
      button: ({ editor, t }: any) => ({
        component: SearchAndReplaceButton,
        componentProps: {
          action: () => {
            return;
          },
          icon: 'SearchAndReplace',
          tooltip: t('editor.searchAndReplace.tooltip'),
          isActive: () => false,
          disabled: false,
          editor,
        },
      }),
    };
  },

  addStorage() {
    return {
      results: [],
      currentIndex: -1,
    };
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string) =>
          ({ state, dispatch }) => {
            this.options.searchTerm = searchTerm;
            this.storage.results = [];
            this.storage.currentIndex = 0;
            dispatchEvent(EVENTS.SEARCH_REPLCE);
            updateView(state, dispatch);
            return false;
          },
      setReplaceTerm:
        (replaceTerm: string) =>
          ({ state, dispatch }) => {
            this.options.replaceTerm = replaceTerm;

            updateView(state, dispatch);

            return false;
          },
      setCaseSensitive: (caseSensitive: boolean) => ({ state, dispatch }) => {
        this.options.caseSensitive = caseSensitive;
        updateView(state, dispatch);
        return false;
      },
      replace:
        () =>
          ({ state, dispatch }) => {
            const { replaceTerm } = this.options;
            const { currentIndex, results } = this.storage;
            const currentResult = results[currentIndex];

            if (currentResult) {
              replace(replaceTerm, [currentResult], { state, dispatch });
              this.storage.results.splice(currentIndex, 1);
            } else {
              replace(replaceTerm, results, { state, dispatch });
              this.storage.results.shift();
            }

            dispatchEvent(EVENTS.SEARCH_REPLCE);

            updateView(state, dispatch);

            return false;
          },
      replaceAll:
        () =>
          ({ state, tr, dispatch }) => {
            const { replaceTerm } = this.options;
            const { results } = this.storage;

            replaceAll(replaceTerm, results, { tr, dispatch });

            this.storage.currentIndex = -1;
            this.storage.results = [];
            dispatchEvent(EVENTS.SEARCH_REPLCE);

            updateView(state, dispatch);

            return false;
          },
      goToPrevSearchResult:
        () =>
          ({ view, tr }: any) => {
            const { searchResultCurrentClass } = this.options;
            const { currentIndex, results } = this.storage;
            const nextIndex = (currentIndex + results.length - 1) % results.length;
            this.storage.currentIndex = nextIndex;
            dispatchEvent(EVENTS.SEARCH_REPLCE);

            return gotoSearchResult({
              view,
              tr,
              searchResults: results,
              searchResultCurrentClass,
              gotoIndex: nextIndex,
            });
          },
      goToNextSearchResult:
        () =>
          ({ view, tr }: any) => {
            const { searchResultCurrentClass } = this.options;
            const { currentIndex, results } = this.storage;
            const nextIndex = (currentIndex + 1) % results.length;
            this.storage.currentIndex = nextIndex;
            this.options.onChange && this.options.onChange();
            dispatchEvent(EVENTS.SEARCH_REPLCE);

            return gotoSearchResult({
              view,
              tr,
              searchResults: results,
              searchResultCurrentClass,
              gotoIndex: nextIndex,
            });
          },
    };
  },

  addProseMirrorPlugins() {
    const extensionThis = this;

    return [
      new Plugin({
        key: new PluginKey('search'),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(ctx) {
            const { doc, docChanged } = ctx;

            const { searchTerm, searchResultClass, searchResultCurrentClass, disableRegex, caseSensitive }
              = extensionThis.options;

            if (docChanged || searchTerm) {
              const { decorationsToReturn, results } = processSearches(
                doc,
                regex(searchTerm, disableRegex, caseSensitive),
                searchResultClass,
              );
              extensionThis.storage.results = results;
              if (extensionThis.storage.currentIndex > results.length - 1) {
                extensionThis.storage.currentIndex = 0;
              }
              dispatchEvent(EVENTS.SEARCH_REPLCE);
              if (ctx.getMeta('directDecoration')) {
                const { fromPos, toPos, attrs } = ctx.getMeta('directDecoration');
                decorationsToReturn.push(Decoration.inline(fromPos, toPos, attrs));
              } else {
                if (results.length > 0) {
                  decorationsToReturn[0] = Decoration.inline(results[0].from, results[0].to, {
                    class: searchResultCurrentClass,
                  });
                }
              }

              return DecorationSet.create(doc, decorationsToReturn);
            }
            return DecorationSet.empty;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
