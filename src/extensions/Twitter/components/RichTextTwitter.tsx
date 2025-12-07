import { useState } from 'react';

import { ActionButton, IconComponent, Popover, PopoverContent, PopoverTrigger } from '@/components';
import FormEditLinkTwitter from '@/extensions/Twitter/components/FormEditLinkTwitter';
import { Twitter } from '@/extensions/Twitter/Twitter';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useEditorInstance } from '@/store/editor';

export function RichTextTwitter() {
  const [open, setOpen] = useState(false);
  const editor = useEditorInstance();

  const buttonProps = useButtonProps(Twitter.name);

  const {
    icon = undefined,
    tooltip = undefined,
    tooltipOptions = {},
    action = undefined,
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive(isActive);

  function onSetLink(src: string) {
    if (editorDisabled) return;

    if (action) {
      action(src);
      setOpen(false);
    }
  }

  return (
    <Popover
    modal
    onOpenChange={setOpen}
    open={open}
    >
      <PopoverTrigger asChild>
        <ActionButton
          disabled={editorDisabled}
          isActive={isActive}
          tooltip={tooltip}
          tooltipOptions={tooltipOptions}
        >
          <IconComponent name={icon} />
        </ActionButton>
      </PopoverTrigger>

      <PopoverContent align="start"
className="richtext-w-full"
hideWhenDetached
side="bottom"
      >
        <FormEditLinkTwitter editor={editor}
onSetLink={onSetLink}
        />
      </PopoverContent>
    </Popover>
  );
}
