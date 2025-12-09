/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useRef, useState } from 'react';

// @ts-ignore
import svg64 from 'svg64';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Mermaid } from '@/extensions/Mermaid/Mermaid';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useEditorInstance } from '@/store/editor';
import { dataURLtoFile } from '@/utils/file';
import { shortId } from '@/utils/shortId';

const defaultCode = 'graph TB\na-->b';

export function RichTextMermaid () {
  const editor = useEditorInstance();

  const buttonProps = useButtonProps(Mermaid.name);

  const {
    tooltipOptions = {},
    isActive = undefined,
    upload
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive(isActive);

  const [mermaidCode, setMermaidCode] = useState(defaultCode);
  const [svgCode, setSvgCode] = useState('');
  const [visible, toggleVisible] = useState(false);
  const mermaidRef = useRef<HTMLElement | null>(null);
  const [mermaidInstance, setMermaidInstance] = useState<any>(null);
  const [loading, toggleLoading] = useState(true);

  const loadMermaid = useCallback(
    (div: any) => {
      if (!div)
        return;

      import('mermaid')
        .then((res) => {
          setMermaidInstance(res.default);
        })
        .finally(() => toggleLoading(false));
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
    if (!loading && mermaidInstance && visible) {
      mermaidInit();
    }
  }, [mermaidInstance, visible]);

  useEffect(() => {
    if (!loading && mermaidInstance && visible) {
      renderMermaid(mermaidCode);
    }
  }, [mermaidInstance && mermaidCode]);

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
          disabled={editorDisabled}
          icon="Mermaid"
          tooltip="Mermaid"
          tooltipOptions={tooltipOptions}
          action={() => {
            if (editorDisabled) {
              return;
            }
            toggleVisible(true);
          }}
        />
      </DialogTrigger>

      <DialogContent className="richtext-z-[99999] !richtext-max-w-[1300px]">
        <DialogTitle>
          Mermaid
        </DialogTitle>

        <div
          ref={loadMermaid}
          style={{ height: '100%', border: '1px solid hsl(var(--border))' }}
        >
          {loading ?  <p>
              Loading...
          </p> : <>
          <div className="richtext-flex richtext-gap-[10px] richtext-rounded-[10px] richtext-p-[10px]">
            <Textarea
              autoFocus
              className="richtext-flex-1"
              onChange={e => setMermaidCode(e.target.value)}
              placeholder="Text"
              required
              rows={10}
              value={mermaidCode}
              style={{
                color: 'hsl(var(--foreground))',
              }}
            />

            <div
              className="richtext-flex richtext-flex-1 richtext-items-center richtext-justify-center richtext-rounded-[10px] richtext-p-[10px]"
              dangerouslySetInnerHTML={{ __html: svgCode }}
              ref={mermaidRef as any}
              style={{ height: '100%', borderWidth: 1, minHeight: 500, background: '#fff' }}
            />
          </div>
          </>}
        </div>

        <DialogFooter>
          <Button
            disabled={!mermaidInstance}
            onClick={setMermaid}
            type="button"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
