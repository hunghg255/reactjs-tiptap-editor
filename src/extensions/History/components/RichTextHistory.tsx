/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';

import { ActionButton, icons } from '@/components';
import { History } from '@/extensions/History/History';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

export function RichTextUndo() {
  const buttonProps = useButtonProps(History.name);

  const {
    icon = undefined,
    tooltip = undefined,
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
  } = buttonProps?.componentProps?.undo ?? {};

  const { disabled } = useActive(isActive);

  const Icon = icons[icon as string];

  const onAction = () => {
    if (disabled) return;

    if (action) action();
  };

  if (!buttonProps || !Icon) {
    return <></>;
  }

  return (
    <ActionButton
      action={onAction}
      disabled={disabled}
      icon={icon}
      shortcutKeys={shortcutKeys}
      tooltip={tooltip}
      tooltipOptions={tooltipOptions}
    />
  );
}

export function RichTextRedo() {
  const buttonProps = useButtonProps(History.name);

  const {
    icon = undefined,
    tooltip = undefined,
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
  } = buttonProps?.componentProps?.redo ?? {};

  const { disabled } = useActive(isActive);

  const onAction = () => {
    if (disabled) return;

    if (action) action();
  };

  if (!buttonProps) {
    return <></>;
  }

  return (
    <ActionButton
      action={onAction}
      disabled={disabled}
      icon={icon}
      shortcutKeys={shortcutKeys}
      tooltip={tooltip}
      tooltipOptions={tooltipOptions}
    />
  );
}
