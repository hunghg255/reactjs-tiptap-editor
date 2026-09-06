import { useMemo } from 'react';

import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';
import { useEditorInstance } from '@/store/editor';
import { isFunction } from '@/utils/utils';

import type { ButtonViewReturnComponentProps, ButtonViewReturn } from '@/types';

export function useButtonProps<P = ButtonViewReturnComponentProps>(extensionName: string) {
  const editor = useEditorInstance();
  const extension = useExtension(extensionName);
  const { t } = useLocale();

  return useMemo(() => {
    if (!editor || !extension || !t) {
      return null;
    }

    const { button } = extension.options;

    if (!button || !isFunction(button)) {
      return null;
    }

    const buttonProps = button({
      editor,
      extension,
      t,
    });

    return buttonProps as ButtonViewReturn<P>;
  }, [editor, extension, t]);
}
