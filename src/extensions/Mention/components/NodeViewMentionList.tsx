/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';
import clsx from 'clsx';
import scrollIntoView from 'scroll-into-view-if-needed';

interface IProps {
  editor: Editor
  items: Array<{
    id: string
    label: string
    avatar?: {
      src: string
    }
  }>
  command: any
  onClose?: () => void
}

export const NodeViewMentionList: React.FC<IProps> = forwardRef((props, ref) => {
  const $container: any = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: any) => {
    const userName = props.items[index];
    if (!userName)
      return;
    props.command(userName);
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useEffect(() => {
    if (Number.isNaN(selectedIndex + 1))
      return;
    const el = $container.current.querySelector(`span:nth-of-type(${selectedIndex + 1})`);
    el && scrollIntoView(el, { behavior: 'smooth', scrollMode: 'if-needed' });
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className={' !richtext-max-h-[320px] !richtext-w-[160px] richtext-overflow-y-auto richtext-overflow-x-hidden  richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none'}
      data-richtext-portal
      ref={$container}
    >
      <div >
        {props.items.length > 0
          ? (
            props.items.map((item, index) => (
              <span
                className={clsx('richtext-flex richtext-w-full richtext-items-center richtext-gap-3 richtext-rounded-sm !richtext-border-none !richtext-bg-transparent richtext-px-2 richtext-py-1.5 richtext-text-left richtext-text-sm richtext-text-foreground !richtext-outline-none richtext-transition-colors hover:!richtext-bg-accent ', { 'bg-item-active': index === selectedIndex })}
                key={`mention-item-${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  selectItem(index);
                }}
              >
                {
                  item?.avatar?.src && (
                    <img
                      alt={item.label}
                      className="richtext-size-5 richtext-rounded-full"
                      src={item.avatar.src}
                    />
                  )
                }

                {item?.label}
              </span>
            ))
          )
          : (
            <div className={clsx('itemUserEmpty, richtext-text-foreground')}>
              Empty
            </div>
          )}
      </div>
    </div>
  );
});
