/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import scrollIntoView from 'scroll-into-view-if-needed';

import { EMOJI_LIST } from '@/extensions/Emoji/components/EmojiList/emojis';
import { useLocale } from '@/locales';

function EmojiNodeView (props: any, ref: any) {
  const $container: any = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useLocale();

  const filteredEmojis = useMemo(() => {
    const lowerCaseQuery = props?.query?.toLowerCase();

    return EMOJI_LIST.filter(({ name }) =>
      name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [props?.query]);

  const selectItem = (index: any) => {
    const item = filteredEmojis[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + filteredEmojis.length - 1) % filteredEmojis.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % filteredEmojis.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [filteredEmojis]);

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
    <div className="richtext-max-h-[320px] richtext-w-[200px] richtext-overflow-y-auto richtext-overflow-x-hidden  richtext-rounded-md  !richtext-border !richtext-border-solid !richtext-border-border richtext-bg-popover richtext-p-1 richtext-text-popover-foreground richtext-shadow-md richtext-outline-none"
      data-richtext-portal
    >
      <div ref={$container}>
        {filteredEmojis.length > 0
          ? (
            filteredEmojis.map(({ name, emoji }, index) => {

              return (
                <span
                  key={`emoji-list-code-${name}`}
                  onClick={() => selectItem(index)}
                  className={clsx('richtext-flex richtext-w-full richtext-items-center richtext-gap-3 richtext-rounded-sm !richtext-border-none !richtext-bg-transparent richtext-px-2 richtext-py-1.5 richtext-text-left richtext-text-sm richtext-text-foreground !richtext-outline-none richtext-transition-colors hover:!richtext-bg-accent ', {
                    'bg-item-active': index === selectedIndex,
                  })}
                >
                  {emoji}
:
{name}
:
                </span>
              );
            })
          )
          : (
            <div className="richtext-relative richtext-flex  richtext-cursor-default richtext-select-none richtext-items-center richtext-rounded-sm richtext-px-2 richtext-py-1.5 richtext-text-sm richtext-text-foreground richtext-outline-none richtext-transition-colors">
              <span>
                {t('no_result_found')}
              </span>
            </div>
          )}
      </div>
    </div>
  );
}

export default forwardRef(EmojiNodeView);
