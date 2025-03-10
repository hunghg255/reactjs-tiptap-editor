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

const containerStyle = { padding: '0 12px 12px' };

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
        <div style={containerStyle}>
          <form className="richtext-flex richtext-flex-col richtext-gap-2" onSubmit={handleSubmit}>
            <Label className="mb-[6px]">
              Width
            </Label>

            <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
              <div className="richtext-relative richtext-items-center richtext-w-full richtext-max-w-sm">
                <Input
                  type="number"
                  value={form.width}
                  required
                  onChange={e => setForm({ ...form, width: e.target.value })}
                />
              </div>
            </div>

            <Label className="mb-[6px]">
              Max Width
            </Label>

            <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
              <div className="richtext-relative richtext-items-center richtext-w-full richtext-max-w-sm">
                <Input
                  type="number"
                  value={form.maxWidth}
                  required
                  onChange={e => setForm({ ...form, maxWidth: e.target.value })}
                />
              </div>
            </div>
            <Label className="mb-[6px]">
              Height
            </Label>
            <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
              <div className="richtext-relative richtext-items-center richtext-w-full richtext-max-w-sm">
                <Input
                  type="number"
                  value={form.height}
                  required
                  onChange={e => setForm({ ...form, height: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" className="richtext-self-end richtext-mt-2">
              {t('editor.link.dialog.button.apply')}
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
