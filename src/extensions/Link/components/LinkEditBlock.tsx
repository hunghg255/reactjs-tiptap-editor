/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState, useRef } from 'react';

import type { Mark } from '@tiptap/pm/model';

import { Button, IconComponent, Input, Label, Checkbox } from '@/components';
import { Link } from '@/extensions/Link/Link';
import { useExtension } from '@/hooks/useExtension';
import { useLocale } from '@/locales';

interface IPropsLinkEditBlock {
  editor: any;
  onSetLink: (link: string, text?: string, openInNewTab?: boolean) => void;
  open?: boolean;
  target?: string;
  onClose?: () => void;
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
  const extension = useExtension(Link.name);

  useEffect(() => {
    const updateForm = () => {
      const { from, to, empty } = props.editor.state.selection;

      const LinkOptions = extension?.options;

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

    updateForm();

    props.editor.on('selectionUpdate', updateForm);

    return () => {
      props.editor.off('selectionUpdate', updateForm);
    };
  }, [props.editor, extension, props.open]);

  function handleSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();
    props?.onSetLink(form.link, form.text, openInNewTab);
    setForm({ text: '', link: '' });
  }

  return (
    <div className="richtext-flex richtext-flex-col richtext-gap-2">
      <Label className="mb-[6px]">
        {t('editor.link.dialog.text')}
      </Label>

      <div className="richtext-mb-[10px] richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5">
        <div className="richtext-relative richtext-w-full richtext-max-w-sm richtext-items-center">
          <Input
            className="richtext-w-80"
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Text"
            ref={textInputRef}
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
            className="richtext-pl-10"
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            ref={linkInputRef}
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
        <div className="richtext-flex richtext-items-center richtext-gap-1">
          <Checkbox
            checked={openInNewTab}
            onCheckedChange={(v) => {
              setOpenInNewTab(v as boolean);
            }}
          />

          <Label>
            {t('editor.link.dialog.openInNewTab')}
          </Label>
        </div>
      )}

      <div className='richtext-mt-2 richtext-flex richtext-items-center richtext-justify-end richtext-gap-2'>
        {
          props?.onClose && <Button
            onClick={props?.onClose}
            type="button"
                            >
            {t('editor.link.dialog.button.cancel')}
          </Button>
        }

        <Button
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
