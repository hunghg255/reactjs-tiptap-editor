/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';
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

interface IProps {
  editor: Editor, upload?: any
}

export const DrawerActiveButton: React.FC<IProps> = ({ editor, upload }) => {
  const [visible, toggleVisible] = useState(false);
  const refEditor = useRef<Editor4 | null>(null);
  const refWidget = useRef<any>(null);

  const mermaidInit = () => {
    const init = async () => {
      const parentElement = document.querySelector('#easydrawer');

      if (!parentElement) return;

      refEditor.current = new Editor4(parentElement as any, {
        wheelEventsEnabled: false,
        disableZoom: true,
      });

      refWidget.current = makeDropdownToolbar(refEditor.current);
      refWidget.current.addDefaultToolWidgets();
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
      // const { width, height } = svg.getBoundingClientRect();
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
          icon="PencilRuler"
          tooltip="Drawer"
        />
      </DialogTrigger>

      <DialogContent className="richtext-z-[99999] !richtext-max-w-[1300px]">
        <DialogTitle>
          Drawer
        </DialogTitle>

        <div style={{ height: '600px', width: '100%', borderWidth: 1, background: 'white', position: 'relative' }}>
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
};
