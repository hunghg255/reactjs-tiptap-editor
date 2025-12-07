import { ActionButton } from '@/components';
import { HorizontalRule } from '@/extensions/HorizontalRule/HorizontalRule';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

export function RichTextHorizontalRule() {
  const buttonProps = useButtonProps(HorizontalRule.name);

  const {
    icon = undefined,
    tooltip = undefined,
    shortcutKeys = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { dataState, disabled, update } = useToggleActive(isActive);

  const onAction = () => {
    if (disabled) return;

    if (action) {
      action();
      update();
    }
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
