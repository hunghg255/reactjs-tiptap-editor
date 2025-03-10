import React from 'react';

import { truncate } from 'lodash-es';

import { ActionButton, Separator } from '@/components';
import { useLocale } from '@/locales';

interface IPropsLinkViewBlock {
  editor: any
  link: string
  onClear?: any
  onEdit?: any
}

function LinkViewBlock(props: IPropsLinkViewBlock) {
  const { t } = useLocale();

  return (
    <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-p-2 richtext-bg-white !richtext-border richtext-rounded-lg richtext-shadow-sm dark:richtext-bg-black richtext-border-neutral-200 dark:richtext-border-neutral-800">
      <a
        href={props?.link}
        target="_blank"
        rel="noopener noreferrer"
        className="richtext-text-sm richtext-underline richtext-break-all"
      >
        {truncate(props?.link, {
          length: 50,
          omission: '…',
        })}
      </a>
      {props?.link && <Separator orientation="vertical" className="!richtext-h-4" />}
      <div className="richtext-flex richtext-flex-nowrap">
        <ActionButton
          icon="Pencil"
          tooltip={t('editor.link.edit.tooltip')}
          action={() => {
            props?.onEdit();
          }}
          tooltipOptions={{ sideOffset: 15 }}
        />
        <ActionButton
          icon="Unlink"
          tooltip={t('editor.link.unlink.tooltip')}
          action={() => {
            props?.onClear();
          }}
          tooltipOptions={{ sideOffset: 15 }}
        />
      </div>
    </div>
  );
}

export default LinkViewBlock;
