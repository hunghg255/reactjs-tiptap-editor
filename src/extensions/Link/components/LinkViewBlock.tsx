import React from 'react';

import { truncate } from 'lodash-unified';

import ActionButton from '@/components/ActionButton';
import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/locales';

interface IPropsLinkViewBlock {
  editor: any;
  link: string;
  onClear?: any;
  onEdit?: any;
}

const LinkViewBlock = (props: IPropsLinkViewBlock) => {
  const { t } = useLocale();

  return (
    <div className='flex items-center gap-2 p-2 bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800'>
      <a
        href={props?.link}
        target='_blank'
        rel='noopener noreferrer'
        className='text-sm underline break-all'
      >
        {truncate(props?.link, {
          length: 50,
          omission: '…',
        })}
      </a>
      {props?.link && <Separator orientation='vertical' className='h-4' />}
      <div className='flex flex-nowrap'>
        <ActionButton
          icon='Pencil'
          tooltip={t('editor.link.edit.tooltip')}
          action={() => {
            props?.onEdit();
          }}
          tooltipOptions={{ sideOffset: 15 }}
        />
        <ActionButton
          icon='Unlink'
          tooltip={t('editor.link.unlink.tooltip')}
          action={() => {
            props?.onClear();
          }}
          tooltipOptions={{ sideOffset: 15 }}
        />
      </div>
    </div>
  );
};

export default LinkViewBlock;
