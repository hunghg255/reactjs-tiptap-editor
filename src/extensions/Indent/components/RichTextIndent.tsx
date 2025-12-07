import { ActionButton } from '@/components';
import { Indent } from '@/extensions/Indent/Indent';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

export function RichTextIndent() {
  const buttonProps = useButtonProps(Indent.name);

  const {
    indent,
    outdent
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive();

  const onActionIndent = () => {
    if (editorDisabled) return;

    if (indent?.action) {
      indent?.action();
    }
  };

  const onActionOutdent = () => {
    if (editorDisabled) return;

    if (outdent?.action) {
      outdent?.action();
    }
  };

  if (!buttonProps) {
    return <></>;
  }

  return (
    <>
    <ActionButton
      action={onActionIndent}
      disabled={editorDisabled}
      icon={indent?.icon}
      shortcutKeys={indent?.shortcutKeys}
      tooltip={indent?.tooltip}
      // tooltipOptions={indent?.tooltipOptions}
    />

    <ActionButton
      action={onActionOutdent}
      disabled={editorDisabled}
      icon={outdent?.icon}
      shortcutKeys={outdent?.shortcutKeys}
      tooltip={outdent?.tooltip}
      // tooltipOptions={tooltipOptions}
    />
    </>
  );
}
