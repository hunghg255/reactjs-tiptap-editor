/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState, useRef } from 'react';

import { Button, IconComponent, Input, Label, Switch } from '@/components';
import Link from '@/extensions/Link/Link';
import { useLocale } from '@/locales';
import type { Mark } from '@tiptap/pm/model';

interface IPropsLinkEditBlock {
  editor: any;
  onSetLink: (link: string, text?: string, openInNewTab?: boolean) => void;
  open?: boolean;
  target?: string;
}

function LinkEditBlock(props: IPropsLinkEditBlock) {
  const { t } = useLocale();

  const [form, setForm] = useState({
    text: '',
    link: '',
  });
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(false);

  const textInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateForm = () => {
      const { from, to, empty } = props.editor.state.selection;

      const LinkOptions = props.editor.extensionManager.extensions.find(
        (ext: any) => ext.name === Link.name,
      )?.options;

      let text = '';
      let link = '';
      let target = LinkOptions?.HTMLAttributes?.target;

      const node = props.editor.state.doc.nodeAt(from);

      if (node) {
        const linkMark = node.marks.find((mark: Mark) => mark.type.name === 'link');
        if (linkMark) {
          link = linkMark.attrs.href || '';
          target = linkMark.attrs.target;
          if (empty) {
            text = node.text || '';
          } else {
            text = props.editor.state.doc.textBetween(from, to, ' ');
          }
        } else {
          // no link mark at cursor => normal selection
          text = props.editor.state.doc.textBetween(from, to, ' ');
        }
      }
      // if no node found (empty doc or weird selection), fallback to range
      if (!node) {
        text = props.editor.state.doc.textBetween(from, to, ' ');
      }

      setForm({ link, text });
      setOpenInNewTab(props.target ? props.target === '_blank' : target === '_blank');

      if (props.open) {
        // better uexp - focus link input by default
        if (text === '') {
          textInputRef.current?.focus();
        } else {
          linkInputRef.current?.focus();
        }
      }
    };

    // 初始更新
    updateForm();

    // 添加选中变化监听
    props.editor.on('selectionUpdate', updateForm);

    // 清理监听
    return () => {
      props.editor.off('selectionUpdate', updateForm);
    };
  }, [props.editor, props.open]);

  function handleSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    props?.onSetLink(form.link, form.text, openInNewTab);
    setForm({ text: '', link: '' });
  }

  return (
    <div className="border-neutral-200 richtext-rounded-lg !richtext-border richtext-bg-white richtext-p-2 richtext-shadow-sm dark:richtext-border-neutral-800 dark:richtext-bg-black">
      <div className="richtext-flex richtext-flex-col richtext-gap-2">
        <Label className="mb-[6px]">
          {t('editor.link.dialog.text')}
        </Label>

        <div className="richtext-mb-[10px] richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
            <Input
              ref={textInputRef}
              className="richtext-w-80"
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Text"
              required
              type="text"
              value={form.text}
            />
          </div>
        </div>

        <Label className="mb-[6px]">
          {t('editor.link.dialog.link')}
        </Label>

        <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
          <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
            <Input
              ref={linkInputRef}
              className="richtext-pl-10"
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              required
              type="url"
              value={form.link}
            />

            <span className="richtext-absolute richtext-inset-y-0 richtext-start-0 richtext-flex richtext-items-center richtext-justify-center richtext-px-2">
              <IconComponent
                className="richtext-size-5 richtext-text-muted-foreground"
                name="Link"
              />
            </span>
          </div>
        </div>

        {!props.target && (
          <div className="richtext-flex richtext-items-center richtext-space-x-2">
            <Label>
              {t('editor.link.dialog.openInNewTab')}
            </Label>

            <Switch
              checked={openInNewTab}
              onCheckedChange={(e) => {
                setOpenInNewTab(e);
              }}
            />
          </div>
        )}

        <Button
          className="richtext-mt-2 richtext-self-end"
          onClick={handleSubmit}
          type="button"
        >
          {t('editor.link.dialog.button.apply')}
        </Button>
      </div>
    </div>
  );
}

export default LinkEditBlock;
