import type { Editor } from '@tiptap/core';
import React, { useMemo } from 'react';
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

  if (!limit) {
    return (
      <div className="richtext-flex richtext-items-center richtext-justify-between richtext-p-3 richtext-border-t">
        <div className="richtext-flex richtext-flex-col">
          <div className="richtext-flex richtext-justify-end richtext-gap-3 richtext-text-sm">
            <span>
              {(editor as any).storage.characterCount.characters()}
              {' '}
              {t('editor.characters')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="richtext-flex richtext-items-center richtext-justify-between richtext-p-3 richtext-border-t">
      <div className="richtext-flex richtext-flex-col">
        <div className="richtext-flex richtext-justify-end richtext-gap-3 richtext-text-sm">
          <span>
            {editor.storage.characterCount.characters()}
            /
            {limit}
            {' '}
            {t('editor.characters')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CharactorCount;
