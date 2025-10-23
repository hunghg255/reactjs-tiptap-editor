/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useState, useMemo } from 'react';

import type { Editor } from '@tiptap/core';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OPEN_EXCALIDRAW_SETTING_MODAL, cancelSubject, subject } from '@/utils/_event';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

interface IProps {
  editor: Editor, tooltipOptions?: TooltipContentProps
}

export const ExcalidrawActiveButton: React.FC<IProps> = ({ editor, tooltipOptions }) => {
  const excalidrawOptions = useMemo(() => {
    return editor.extensionManager.extensions.find(
      (ext: any) => ext.name === 'excalidraw'
    )?.options || {};
  }, [editor]);

  const [Excalidraw, setExcalidraw] = useState<any>(null);
  const [data, setData] = useState({});
  const [initialData, setInitialData] = useState({ elements: [], appState: { isLoading: false }, files: null });
  const [visible, toggleVisible] = useState(false);
  const [loading, toggleLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const renderEditor = useCallback(
    (div: any) => {
      if (!div)
        return;

      import('@excalidraw/excalidraw')
        .then((res) => {
          setExcalidraw(res.Excalidraw);
        })
        .catch(setError)
        .finally(() => toggleLoading(false));
    },
    [toggleLoading],
  );

  const renderExcalidraw: any = useCallback((app: any) => {
    setTimeout(() => {
      app.refresh();
    });
  }, []);

  const onChange = useCallback((elements: any, appState: any, files: any) => {
    // appState.collaborators = [];
    setData({
      elements,
      appState: { isLoading: false },
      files,
    });
  }, []);

  const save = useCallback(() => {
    if (!Excalidraw) {
      toggleVisible(false);
      return;
    }

    // const currentScrollTop = document.querySelector('main#js-tocs-container')?.scrollTop
    editor.chain().focus().setExcalidraw({ data }).run();
    // setTimeout(() => {
    //   // @ts-expect-error
    //   document.querySelector('main#js-tocs-container').scrollTop = currentScrollTop
    // })
    toggleVisible(false);
  }, [Excalidraw, editor, data, toggleVisible]);

  useEffect(() => {
    const handler = (data: any) => {
      if (data?.editor !== editor) return; // only respond to events from the matching editor

      toggleVisible(true);
      data && setInitialData(data.data);
    };

    subject(OPEN_EXCALIDRAW_SETTING_MODAL, handler);

    return () => {
      cancelSubject(OPEN_EXCALIDRAW_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  useEffect(() => {
    if (!loading && Excalidraw && visible) {
      // delay to let animations & DOM settle
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 400);
    }
  }, [loading, Excalidraw, visible]);

  return (
    <Dialog
      onOpenChange={toggleVisible}
      open={visible}
    >
      <DialogTrigger asChild>
        <ActionButton
          action={() => toggleVisible(true)}
          icon="Excalidraw"
          tooltip="Excalidraw"
          tooltipOptions={tooltipOptions}
        />
      </DialogTrigger>

      <DialogContent className="richtext-z-[99999] !richtext-max-w-[1300px]">
        <DialogTitle>
          Excalidraw
        </DialogTitle>

        <div style={{ height: '100%', borderWidth: 1 }}>
          {loading && (
            <p>
              Loading...
            </p>
          )}

          {error && <p>
            {(error && error.message) || 'Error'}
          </p>}

          <div ref={renderEditor}
            style={{ width: '100%', height: 600 }}
          >
            {!loading && !error && Excalidraw
              ? (
                <Excalidraw initialData={initialData}
                  langCode="en"
                  onChange={onChange}
                  ref={renderExcalidraw}
                  {...excalidrawOptions.excalidrawProps}
                />
              )
              : null}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={save}
            type="button"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
