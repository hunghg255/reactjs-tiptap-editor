import { Fragment } from 'react';

import {
  ActionButton,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconComponent,
} from '@/components';
import { LineHeight } from '@/extensions/LineHeight/LineHeight';
import { useActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

export function RichTextLineHeight() {
  const buttonProps = useButtonProps(LineHeight.name);

  const {
    tooltip = undefined,
    items,
    icon,
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled, dataState } = useActive(isActive);

  if (!buttonProps) {
    return <></>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild
        disabled={editorDisabled}
      >
        <ActionButton
          customClass="!richtext-w-12 richtext-h-12"
          disabled={editorDisabled}
          icon={icon}
          tooltip={tooltip}
        >
          <IconComponent className="richtext-ml-1 richtext-size-3 richtext-text-zinc-500"
            name="MenuDown"
          />
        </ActionButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="richtext-min-w-24">
        {items?.map((item: any, index: any) => {
          return (
            <Fragment key={`line-height-${index}`}>
              <DropdownMenuCheckboxItem
                checked={item.value === (dataState)?.value}
                onClick={() => item?.action()}
              >
                {item.label}
              </DropdownMenuCheckboxItem>

              {item.value === 'Default' && <DropdownMenuSeparator />}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
