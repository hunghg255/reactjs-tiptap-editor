/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Extension, type Range } from '@tiptap/core';
import { type Node as PMNode } from '@tiptap/pm/model';
import {
  Plugin,
  PluginKey,
  type EditorState,
  type Transaction,
} from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export * from '@/extensions/SearchAndReplace/components/RichTextSearchAndReplace';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    search: {
      setSearchTerm: (searchTerm: string) => ReturnType;
      setReplaceTerm: (replaceTerm: string) => ReturnType;
      setCaseSensitive: (caseSensitive: boolean) => ReturnType;
      resetIndex: () => ReturnType;
      nextSearchResult: () => ReturnType;
      previousSearchResult: () => ReturnType;
      replace: () => ReturnType;
      replaceAll: () => ReturnType;
    };
  }
}

interface TextNodesWithPosition {
  text: string;
  pos: number;
}

const updateView = (state: EditorState, dispatch: any) => dispatch(state.tr);

function getRegex (s: string,
  disableRegex: boolean,
  caseSensitive: boolean): RegExp {
  return RegExp(
    disableRegex ? s.replace(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`) : s,
    caseSensitive ? 'gu' : 'gui',
  );
}

interface ProcessedSearches {
  decorationsToReturn: DecorationSet;
  results: Range[];
}

function processSearches(
  doc: PMNode,
  searchTerm: RegExp,
  searchResultClass: string,
  resultIndex: number,
): ProcessedSearches {
  const decorations: Decoration[] = [];
  const results: Range[] = [];

  let textNodesWithPosition: TextNodesWithPosition[] = [];
  let index = 0;

  if (!searchTerm) {
    return {
      decorationsToReturn: DecorationSet.empty,
      results: [],
    };
  }

  doc?.descendants((node, pos) => {
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

  for (const element of textNodesWithPosition) {
    const { text, pos } = element;
    const matches = Array.from(text.matchAll(searchTerm)).filter(
      ([matchText]) => matchText.trim(),
    );

    for (const m of matches) {
      if (m[0] === '') break;

      if (m.index !== undefined) {
        results.push({
          from: pos + m.index,
          to: pos + m.index + m[0].length,
        });
      }
    }
  }

  for (const [i, r] of results.entries()) {
    const className =
      i === resultIndex
        ? `${searchResultClass} ${searchResultClass}-current`
        : searchResultClass;
    const decoration: Decoration = Decoration.inline(r.from, r.to, {
      class: className,
    });

    decorations.push(decoration);
  }

  return {
    decorationsToReturn: DecorationSet.create(doc, decorations),
    results,
  };
}

function replace (replaceTerm: string,
  results: Range[],
  { state, dispatch }: { state: EditorState; dispatch: (tr: Transaction) => void }) {
  const firstResult = results[0];

  if (!firstResult) return;

  const { from, to } = results[0];

  if (dispatch) dispatch(state.tr.insertText(replaceTerm, from, to));
}

function rebaseNextResult (replaceTerm: string,
  index: number,
  lastOffset: number,
  results: Range[]): [number, Range[]] | null {
  const nextIndex = index + 1;

  if (!results[nextIndex]) return null;

  const { from: currentFrom, to: currentTo } = results[index];

  const offset = currentTo - currentFrom - replaceTerm.length + lastOffset;

  const { from, to } = results[nextIndex];

  results[nextIndex] = {
    to: to - offset,
    from: from - offset,
  };

  return [offset, results];
}

function replaceAll (replaceTerm: string,
  results: Range[],
  { tr, dispatch }: { tr: Transaction; dispatch: (tr: Transaction) => void }) {
  let offset = 0;

  let resultsCopy = results.slice();

  if (resultsCopy.length === 0) return;

  for (let i = 0; i < resultsCopy.length; i += 1) {
    const { from, to } = resultsCopy[i];

    tr.insertText(replaceTerm, from, to);

    const rebaseNextResultResponse = rebaseNextResult(
      replaceTerm,
      i,
      offset,
      resultsCopy,
    );

    if (!rebaseNextResultResponse) continue;

    offset = rebaseNextResultResponse[0];
    resultsCopy = rebaseNextResultResponse[1];
  }

  dispatch(tr);
}

export interface SearchAndReplaceOptions {
  searchResultClass: string;
  disableRegex: boolean;
}

export interface SearchAndReplaceStorage {
  searchTerm: string;
  replaceTerm: string;
  results: Range[];
  lastSearchTerm: string;
  caseSensitive: boolean;
  lastCaseSensitive: boolean;
  resultIndex: number;
  lastResultIndex: number;
}

declare module '@tiptap/core' {
  interface Storage {
    searchAndReplace: SearchAndReplaceStorage;
  }
}

export const SearchAndReplace = Extension.create<
  SearchAndReplaceOptions,
  SearchAndReplaceStorage
>({
  name: 'searchAndReplace',

  addOptions() {
    return {
      ...this.parent?.(),
      searchTerm: '',
      replaceTerm: '',
      results: [],
      searchResultClass: 'search-result',
      searchResultCurrentClass: 'search-result-current',
      caseSensitive: false,
      disableRegex: true,
      onChange: () => {
        return;
      },
      button: ({ editor, t }: any) => ({
        // component: RichTextSearchAndReplace,
        componentProps: {
          action: () => {
            return;
          },
          icon: 'SearchAndReplace',
          tooltip: t('editor.searchAndReplace.tooltip'),
          isActive: () => true,
          editor,
        },
      }),
    };
  },

  addStorage() {
    return {
      searchTerm: '',
      replaceTerm: '',
      results: [],
      lastSearchTerm: '',
      caseSensitive: false,
      lastCaseSensitive: false,
      resultIndex: 0,
      lastResultIndex: 0,
    };
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string) =>
        ({ editor, state, dispatch  }) => {
          editor.storage.searchAndReplace.searchTerm = searchTerm;
          updateView(state, dispatch);
          return false;
        },
      setReplaceTerm:
        (replaceTerm: string) =>
        ({ editor, state, dispatch }) => {
          editor.storage.searchAndReplace.replaceTerm = replaceTerm;
          updateView(state, dispatch);

          return false;
        },
      setCaseSensitive:
        (caseSensitive: boolean) =>
        ({ editor, state, dispatch }) => {
          editor.storage.searchAndReplace.caseSensitive = caseSensitive;
          updateView(state, dispatch);

          return false;
        },
      resetIndex:
        () =>
        ({ editor, state, dispatch  }) => {
          editor.storage.searchAndReplace.resultIndex = 0;
          updateView(state, dispatch);

          return false;
        },
      nextSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.searchAndReplace;

          const nextIndex = resultIndex + 1;

          if (results[nextIndex]) {
            editor.storage.searchAndReplace.resultIndex = nextIndex;
          } else {
            editor.storage.searchAndReplace.resultIndex = 0;
          }

          return false;
        },
      previousSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.searchAndReplace;

          const prevIndex = resultIndex - 1;

          if (results[prevIndex]) {
            editor.storage.searchAndReplace.resultIndex = prevIndex;
          } else {
            editor.storage.searchAndReplace.resultIndex = results.length - 1;
          }

          return false;
        },
      replace:
        () =>
        ({ editor, state, dispatch }) => {
          const { replaceTerm, results, resultIndex } = editor.storage.searchAndReplace;

            const currentResult = results[resultIndex];

            if (currentResult) {
          //@ts-expect-error
              replace(replaceTerm, [currentResult], { state, dispatch });
              editor.storage.searchAndReplace.results.splice(resultIndex, 1);
            } else {
          //@ts-expect-error
              replace(replaceTerm, results, { state, dispatch });
              editor.storage.searchAndReplace.results.shift();
            }
          updateView(state, dispatch);

          return false;
        },
      replaceAll:
        () =>
        ({ editor, tr, state, dispatch }) => {
          const { replaceTerm, results } = editor.storage.searchAndReplace;
          //@ts-expect-error
          replaceAll(replaceTerm, results, { tr, dispatch });
          editor.storage.searchAndReplace.resultIndex = 0;
          editor.storage.searchAndReplace.results = [];
          updateView(state, dispatch);

          return false;
        },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    const { searchResultClass, disableRegex } = this.options;

    const setLastSearchTerm = (t: string) =>
      (editor.storage.searchAndReplace.lastSearchTerm = t);
    const setLastCaseSensitive = (t: boolean) =>
      (editor.storage.searchAndReplace.lastCaseSensitive = t);
    const setLastResultIndex = (t: number) =>
      (editor.storage.searchAndReplace.lastResultIndex = t);

    return [
      new Plugin({
        key: new PluginKey(`richtextCustomPlugin${this.name}`),
        state: {
          init: () => DecorationSet.empty,
          apply({ doc, docChanged }, oldState) {
            const {
              searchTerm,
              lastSearchTerm,
              caseSensitive,
              lastCaseSensitive,
              resultIndex,
              lastResultIndex,
            } = editor.storage.searchAndReplace;

            if (
              !docChanged &&
              lastSearchTerm === searchTerm &&
              lastCaseSensitive === caseSensitive &&
              lastResultIndex === resultIndex
            )
              return oldState;

            setLastSearchTerm(searchTerm);
            setLastCaseSensitive(caseSensitive);
            setLastResultIndex(resultIndex);

            if (!searchTerm) {
              editor.storage.searchAndReplace.results = [];
              return DecorationSet.empty;
            }

            const { decorationsToReturn, results } = processSearches(
              doc,
              getRegex(searchTerm, disableRegex, caseSensitive),
              searchResultClass,
              resultIndex,
            );

            editor.storage.searchAndReplace.results = results;

            return decorationsToReturn;
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
