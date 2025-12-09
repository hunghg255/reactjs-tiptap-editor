import { useEffect, useState } from 'react';

import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { useLocale } from '@/locales';

interface ISize {
  width: number | string, height: number | string
}

interface IProps {
  width: number | string
  maxWidth?: number | string
  height: number | string
  onOk: (arg: ISize) => void
  children: React.ReactNode
}

export const SizeSetter: React.FC<IProps> = ({ width, maxWidth, height, onOk, children }: any) => {
  const { t } = useLocale();

  const [form, setForm] = useState({
    width: '',
    height: '',
    maxWidth: '',
  });

  useEffect(() => {
    setForm({
      width,
      height,
      maxWidth,
    });
  }, [height, maxWidth, width]);

  function handleSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    onOk(form);
  }

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>

      <PopoverContent>
        <form className="richtext-flex richtext-flex-col richtext-gap-2"
onSubmit={handleSubmit}
        >
          <Label className="mb-[6px]">
            Width
          </Label>

          <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
            <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
              <Input
                onChange={e => setForm({ ...form, width: e.target.value })}
                required
                type="number"
                value={form.width}
              />
            </div>
          </div>

          <Label className="mb-[6px]">
            Max Width
          </Label>

          <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
            <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
              <Input
                onChange={e => setForm({ ...form, maxWidth: e.target.value })}
                required
                type="number"
                value={form.maxWidth}
              />
            </div>
          </div>

          <Label className="mb-[6px]">
            Height
          </Label>

          <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
            <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
              <Input
                onChange={e => setForm({ ...form, height: e.target.value })}
                required
                type="number"
                value={form.height}
              />
            </div>
          </div>

          <Button className="richtext-mt-2 richtext-self-end"
type="submit"
          >
            {t('editor.link.dialog.button.apply')}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
