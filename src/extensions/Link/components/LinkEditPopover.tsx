import React, { Fragment } from 'react';

import ActionButton from '@/components/ActionButton';
import Icon from '@/components/icons/Icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LinkEditBlock from '@/extensions/Link/components/LinkEditBlock';
import { ButtonViewReturnComponentProps } from '@/types';

interface IPropsLinkEditPopover {
  editor: any;
  icon?: any;
  title?: string;
  tooltip?: string;
  disabled?: boolean;
  shortcutKeys?: string[];
  isActive?: ButtonViewReturnComponentProps['isActive'];
  action?: ButtonViewReturnComponentProps['action'];
}

const LinkEditPopover = (props: IPropsLinkEditPopover) => {
  function onSetLink(link: string, text?: string, openInNewTab?: boolean) {
    if (props.action) {
      props.action({ link, text, openInNewTab });
    }
  }

  return (
    <Popover>
      <PopoverTrigger disabled={props?.disabled}>
        <Fragment>
          <ActionButton
            tooltip={props?.tooltip}
            isActive={props?.isActive}
            disabled={props?.disabled}
          >
            <Icon name={props?.icon} />
          </ActionButton>
        </Fragment>
      </PopoverTrigger>
      <PopoverContent hideWhenDetached className='w-full' align='start' side='bottom'>
        <LinkEditBlock editor={props.editor} onSetLink={onSetLink} />
      </PopoverContent>
    </Popover>
  );
};

export default LinkEditPopover;
