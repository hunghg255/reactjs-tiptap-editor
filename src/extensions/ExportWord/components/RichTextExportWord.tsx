import { ActionButton } from '@/components';
import { ExportWord } from '@/extensions/ExportWord/ExportWord';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useState } from 'react';

export function RichTextExportWord() {
  const buttonProps = useButtonProps(ExportWord.name);
  const [loading, setLoading] = useState(false);

  const {
    icon = undefined,
    tooltip = undefined,
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { dataState, disabled, update } = useToggleActive(isActive);

  const onAction = async () => {
    if (disabled || loading) return;

    if (action) {
      setLoading(true);
      await action();
      update();
      setLoading(false);
    }
  };

  if (!buttonProps) {
    return <></>;
  }

  return (
    <ActionButton
      action={onAction}
      dataState={dataState}
      disabled={disabled || loading}
      icon={loading ? 'Loader' : icon}
      shortcutKeys={shortcutKeys}
      tooltip={tooltip}
      tooltipOptions={tooltipOptions}
    />
  );
}
