import React, { useMemo } from 'react';

import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';

import { useLocale } from '@/locales';

interface IPropsCharactorCount {
  editor: Editor
  extensions: any
}

function CharactorCount({ editor, extensions }: IPropsCharactorCount) {
  const { t } = useLocale();

  const limit = useMemo(() => {
    return extensions?.find((extension: any) => extension.name === 'base-kit')?.options?.characterCount?.limit;
  }, [extensions]);

  const { charactersCount, wordsCount } = useEditorState({
    editor,
    selector: context => ({
      charactersCount: context.editor.storage.characterCount.characters(),
      wordsCount: context.editor.storage.characterCount.words(),
    }),
  });

  if (!editor) {
    return null;
  }

  const percentage = editor ? Math.round((100 / (limit || 1)) * charactersCount) : 0;

  if (!limit) {
    return (
      <div className={`character-count ${charactersCount === limit ? 'character-count--warning' : ''}`}>
      <svg height="20"
        viewBox="0 0 20 20"
        width="20"
      >
        <circle cx="10"
          cy="10"
          fill="#e9ecef"
          r="10"
        />

        <circle
          cx="10"
          cy="10"
          fill="transparent"
          r="5"
          stroke="currentColor"
          strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
          strokeWidth="10"
          transform="rotate(-90) translate(-20)"
        />

        <circle cx="10"
          cy="10"
          fill="white"
          r="6"
        />
      </svg>

      {charactersCount}
      {' '}
      /
      {' '}
      {t('editor.characters')}
      <br />
      {wordsCount}
      {' '}
      {t('editor.words')}
      </div>
    );
  }

  return (
    <div className={`character-count ${charactersCount === limit ? 'character-count--warning' : ''}`}>
      <svg height="20"
        viewBox="0 0 20 20"
        width="20"
      >
        <circle cx="10"
          cy="10"
          fill="#e9ecef"
          r="10"
        />

        <circle
          cx="10"
          cy="10"
          fill="transparent"
          r="5"
          stroke="currentColor"
          strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
          strokeWidth="10"
          transform="rotate(-90) translate(-20)"
        />

        <circle cx="10"
          cy="10"
          fill="white"
          r="6"
        />
      </svg>

      {charactersCount}
      {' '}
      /
      {limit}
      {' '}
      {t('editor.characters')}
      <br />
      {wordsCount}
      {' '}
      {t('editor.words')}
    </div>
  );
}

export default CharactorCount;
