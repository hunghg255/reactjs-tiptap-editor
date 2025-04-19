/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';

// @ts-ignore
import svg64 from 'svg64';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { dataURLtoFile } from '@/utils/file';
import { shortId } from '@/utils/shortId';

interface IProps {
  editor: Editor, attrs?: any, extension?: any
}

const defaultCode = 'graph TB\na-->b';

export const EditMermaidBlock: React.FC<IProps> = ({ editor, attrs, extension }) => {
  const { alt, align } = attrs;
  const [mermaidCode, setMermaidCode] = useState(decodeURIComponent(alt ?? defaultCode));
  const [svgCode, setSvgCode] = useState('');
  const [visible, toggleVisible] = useState(false);
  const mermaidRef = useRef<HTMLElement | null>(null);
  const [mermaidInstance, setMermaidInstance] = useState<any>(null);

  const upload = extension?.options.upload;

  const loadMermaid = useCallback(
    (div: any) => {
      if (!div)
        return;

      import('mermaid')
        .then((res) => {
          setMermaidInstance(res.default);
        });
    },
    [],
  );

  const renderMermaid = async (value: any) => {
    try {
      const { svg } = await mermaidInstance.render('mermaid-svg', value);
      setSvgCode(svg);
    } catch {
      setSvgCode('');
    }
  };

  const mermaidInit = () => {
    mermaidInstance.initialize({
      darkMode: false,
      startOnLoad: false,
      // fontFamily:'',
      fontSize: 12,
      theme: 'base',
    });
    renderMermaid(mermaidCode);
  };

  useEffect(() => {
    if (mermaidInstance && visible) {
      mermaidInit();
    }
  }, [mermaidInstance, visible]);

  useEffect(() => {
    if (mermaidInstance && visible) {
      renderMermaid(mermaidCode);
    }
  }, [mermaidInstance, mermaidCode]);

  const setMermaid = async () => {
    if (mermaidCode === '') {
      return;
    }
    if (mermaidCode) {
      const svg = mermaidRef.current!.querySelector('svg') as unknown as HTMLElement;
      const { width, height } = svg.getBoundingClientRect();
      const name = `mermaid-${shortId()}.svg`;
      // const { size } = new Blob([svg.outerHTML], {
      //   type: 'image/svg+xml',
      // })

      let src = svg64(svg.outerHTML);

      if (upload) {
        const file = dataURLtoFile(src, name);
        src = await upload(file);
      }

      editor
        ?.chain()
        .focus()
        .setMermaid(
          {
            type: 'mermaid',
            src,
            alt: encodeURIComponent(mermaidCode),
            width,
            height,
          },
          !!mermaidCode,
        )
        .run();
      editor?.commands.setAlignImageMermaid(align);
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
          tooltip="Edit Mermaid"
        />
      </DialogTrigger>

      <DialogContent className="richtext-z-[99999] !richtext-max-w-[1300px]">
        <DialogTitle>
          Edit Mermaid
        </DialogTitle>

        <div ref={loadMermaid}
          style={{ height: '100%', border: '1px solid hsl(var(--border))' }}
        >
          <div className="richtext-flex richtext-gap-[10px] richtext-rounded-[10px] richtext-p-[10px]">
            <Textarea
              autoFocus
              className="richtext-flex-1"
              defaultValue={defaultCode}
              onChange={e => setMermaidCode(e.target.value)}
              placeholder="Text"
              required
              rows={10}
              value={mermaidCode}
              style={{
                color: 'hsl(var(--richtext-foreground))',
              }}
            />

            <div
              className="richtext-flex richtext-flex-1 richtext-items-center richtext-justify-center richtext-rounded-[10px] richtext-p-[10px]"
              dangerouslySetInnerHTML={{ __html: svgCode }}
              ref={mermaidRef as any}
              style={{ height: '100%', border: '1px solid hsl(var(--border))', minHeight: 500, background: '#fff' }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={setMermaid}
            type="button"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
