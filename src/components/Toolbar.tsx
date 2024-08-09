import React, { useMemo } from 'react';

import { Separator } from '@/components/ui/separator';
import { useLocale } from '@/locales';
import { isFunction } from '@/utils/utils';

const Toolbar = ({ editor, disabled }: any) => {
  const { t, lang } = useLocale();

  const items = useMemo(() => {
    const extensions = [...editor.extensionManager.extensions];
    const sortExtensions = extensions.sort((arr, acc) => {
      const a = arr.options.sort ?? -1;
      const b = acc.options.sort ?? -1;
      return a - b;
    });

    let menus: any[] = [];

    for (const extension of sortExtensions) {
      const { button, divider = false, spacer = false, toolbar = true } = extension.options;
      if (!button || !isFunction(button) || !toolbar) {
        continue;
      }

      const _button: any = button({
        editor,
        extension,
        t,
      });

      if (Array.isArray(_button)) {
        const menu: any[] = _button.map((k, i) => ({
          button: k,
          divider: i === _button.length - 1 ? divider : false,
          spacer: i === 0 ? spacer : false,
        }));
        menus = [...menus, ...menu];
        continue;
      }

      menus.push({ button: _button, divider, spacer });
    }
    return menus;
  }, [editor, t, lang]);

  return (
    <div
      className='border-b py-2 px-1'
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div className='flex flex-wrap h-auto relative gap-y-1 gap-x-1'>
        {items.map((item: any, key) => {
          const ButtonComponent = item.button.component;

          return (
            <div className='flex items-center' key={key}>
              {item?.spacer && <Separator orientation='vertical' className='h-[16px] mx-[10px]' />}

              <ButtonComponent
                {...item.button.componentProps}
                disabled={disabled || item?.button?.componentProps?.disabled}
              />

              {item?.divider && <Separator orientation='vertical' className='h-auto mx-2' />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Toolbar;
