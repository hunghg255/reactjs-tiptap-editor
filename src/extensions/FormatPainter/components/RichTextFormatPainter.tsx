import { useEffect, useState } from 'react';

import { ActionButton } from '@/components';
import { FormatPainter } from '@/extensions/FormatPainter/FormatPainter';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useEditorInstance } from '@/store/editor';
import { useEditableEditor } from '@/store/store';

export function RichTextFormatPainter() {
  const editor = useEditorInstance();
  const editable = useEditableEditor();
  const buttonProps = useButtonProps(FormatPainter.name);

  const {
    icon = undefined,
    tooltip = undefined,
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const [dataState, setDataState] = useState(() => !!isActive?.());

  useEffect(() => {
    if (!editor || !isActive) return;

    const listener = () => {
      setDataState(!!isActive());
    };

    listener();

    editor.on('selectionUpdate', listener);
    editor.on('transaction', listener);

    return () => {
      editor.off('selectionUpdate', listener);
      editor.off('transaction', listener);
    };
  }, [editor, isActive]);

  const disabled = !editable || !editor;

  const onAction = () => {
    if (disabled) return;

    action?.();
  };

  if (!buttonProps) {
    return <></>;
  }

  return (
    <ActionButton
      action={onAction}
      dataState={dataState}
      disabled={disabled}
      icon={icon}
      shortcutKeys={shortcutKeys}
      tooltip={tooltip}
      tooltipOptions={tooltipOptions}
    />
  );
}
