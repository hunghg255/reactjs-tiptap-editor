/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';
import clsx from 'clsx';
import scrollIntoView from 'scroll-into-view-if-needed';

import styles from './index.module.scss';

interface IProps {
  editor: Editor
  items: Array<string>
  command: any
}

export const NodeViewMentionList: React.FC<IProps> = forwardRef((props, ref) => {
  const $container: any = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: any) => {
    const userName = props.items[index];
    if (!userName)
      return;
    props.command({ id: userName, label: userName });
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
    <div className={clsx('listUsers', styles.listUsers)}>
      <div ref={$container}>
        {props.items.length > 0
          ? (
            props.items.map((item, index) => (
              <span
                className={clsx('itemUser', styles.itemUser, index === selectedIndex ? styles.selectedUser : '')}
                key={index}
                onClick={() => selectItem(index)}
              >
                {item}
              </span>
            ))
          )
          : (
            <div className={clsx('itemUserEmpty', styles.itemUser)}>
              Empty
            </div>
          )}
      </div>
    </div>
  );
});
