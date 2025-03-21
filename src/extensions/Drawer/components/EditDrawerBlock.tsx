/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';

import {
  makeDropdownToolbar,
  Editor as Editor4,
} from 'easydrawer';
// @ts-ignore
import svg64 from 'svg64';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { dataURLtoFile } from '@/utils/file';
import { shortId } from '@/utils/shortId';

export function EditDrawerBlock ({ editor, attrs, extension }: any) {
  const [visible, toggleVisible] = useState(false);
  const refEditor = useRef<Editor4 | null>(null);
  const refWidget = useRef<any>(null);
  const { alt, align } = attrs;
  const upload = extension?.options.upload;

  const mermaidInit = () => {
    const init = async () => {
      const parentElement = document.querySelector('#easydrawer');

      if (!parentElement) return;

      refEditor.current = new Editor4(parentElement as any);

      refWidget.current = makeDropdownToolbar(refEditor.current);
      refWidget.current.addDefaultToolWidgets();

      refEditor.current.loadFromSVG(decodeURIComponent(alt));
    };

    init();
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        mermaidInit();
      }, 200);
    }
  }, [visible]);

  const setSvg = async () => {
    if (refEditor.current) {
      const svg = refEditor.current.toSVG() as unknown as HTMLElement;
      const contentHtml = svg.outerHTML;
      const name = `drawer-${shortId()}.svg`;

      let src = svg64(svg.outerHTML);

      if (upload) {
        const file = dataURLtoFile(src, name);
        src = await upload(file);
      }

      editor
        ?.chain()
        .focus()
        .setDrawer(
          {
            type: 'drawer',
            src,
            alt: encodeURIComponent(contentHtml),
            width: 426,
            height: 212
          },
          !!contentHtml,
        )
        .run();
      editor?.commands.setAlignImageDrawer(align);
    }
    toggleVisible(false);
  };

  return (
    <Dialog
      onOpenChange={toggleVisible}
      open={visible}
    >
      <DialogTrigger asChild>
        <ActionButton
          action={() => toggleVisible(true)}
          icon="Pencil"
          tooltip="Edit Drawer"
        />
      </DialogTrigger>

      <DialogContent className="richtext-z-[99999] !richtext-max-w-[1300px]">
        <DialogTitle>
          Edit Drawer
        </DialogTitle>

        <div style={{ height: '100%', borderWidth: 1, background: 'white', position: 'relative' }}>
          <div
            className='richtext-size-full'
            id='easydrawer'
          >
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={setSvg}
            type="button"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
