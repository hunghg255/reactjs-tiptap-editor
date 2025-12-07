import React from 'react';

import { ActionButton } from '@/components';
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
    <div className="richtext-flex richtext-items-center richtext-gap-2 richtext-rounded-lg !richtext-border richtext-border-neutral-200 richtext-bg-white richtext-p-2 richtext-shadow-sm dark:richtext-border-neutral-800 dark:richtext-bg-black">
      <div className="richtext-flex richtext-flex-nowrap">
        <ActionButton
          disabled={!props?.link}
          icon="ExternalLink"
          tooltip={t('editor.link.open.tooltip')}
          tooltipOptions={{ sideOffset: 15 }}
          action={() => {
            window.open(props?.link, '_blank');
          }}
        />

        <ActionButton
          icon="Pencil"
          tooltip={t('editor.link.edit.tooltip')}
          tooltipOptions={{ sideOffset: 15 }}
          action={() => {
            props?.onEdit();
          }}
        />

        <ActionButton
          icon="Unlink"
          tooltip={t('editor.link.unlink.tooltip')}
          tooltipOptions={{ sideOffset: 15 }}
          action={() => {
            props?.onClear();
          }}
        />
      </div>
    </div>
  );
}

export default LinkViewBlock;
