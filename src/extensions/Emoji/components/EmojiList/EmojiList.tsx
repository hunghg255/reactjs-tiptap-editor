/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import clsx from 'clsx';
import scrollIntoView from 'scroll-into-view-if-needed';

import { useLocale } from '@/locales';

interface IProps {
  items: Array<{ name: string, emoji: string, fallbackImage?: string }>
  command: any
}

export const EmojiList: React.FC<IProps> = forwardRef((props, ref) => {
  const $container: any = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useLocale();

  const selectItem = (index: any) => {
    const item = props.items[index];

    if (item) {
      props.command(item);
    }
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
    <div className="richtext-max-h-[320px] richtext-w-[200px] richtext-overflow-y-auto richtext-overflow-x-hidden richtext-rounded-sm !richtext-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none">
      <div ref={$container}>
        {props.items.length > 0
          ? (
            props.items.map((item, index) => (
              <span
                className={clsx(' richtext-relative richtext-flex  richtext-cursor-default richtext-select-none richtext-items-center richtext-rounded-sm richtext-px-2 richtext-py-1.5 richtext-text-sm richtext-outline-none richtext-transition-colors hover:richtext-bg-accent focus:richtext-bg-accent  focus:richtext-text-accent-foreground', index === selectedIndex ? 'bg-accent' : '')}
                key={`emoji-list-code-${index}`}
                onClick={() => selectItem(index)}
              >
                {item.fallbackImage ? <img className="richtext-size-[1em]"
                  src={item.fallbackImage}
                /> : item.emoji}
                :

                {item.name}
                :
              </span>
            ))
          )
          : (
            <div className="richtext-relative richtext-flex  richtext-cursor-default richtext-select-none richtext-items-center richtext-rounded-sm richtext-px-2 richtext-py-1.5 richtext-text-sm richtext-outline-none richtext-transition-colors">
              <span>
                {t('no_result_found')}
              </span>
            </div>
          )}
      </div>
    </div>
  );
});

EmojiList.displayName = 'EmojiList';
