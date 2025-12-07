/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useState, useMemo } from 'react';

import { ActionButton } from '@/components/ActionButton';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';
import { useExtension } from '@/hooks/useExtension';
import { useEditorInstance } from '@/store/editor';
import { OPEN_EXCALIDRAW_SETTING_MODAL, cancelSubject, subject } from '@/utils/_event';

import { Excalidraw as ExcalidrawExtension } from '../Excalidraw';

export function RichTextExcalidraw () {

  const editor = useEditorInstance();

  const buttonProps = useButtonProps(ExcalidrawExtension.name);

  const extension = useExtension(ExcalidrawExtension.name);

  const {
    tooltipOptions = {},
    isActive = undefined,
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive(isActive);

  const excalidrawOptions = useMemo(() => {
    return extension?.options || {};
  }, [extension]);

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

    editor.chain().focus().setExcalidraw({ data }).run();
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
          disabled={editorDisabled}
          icon="Excalidraw"
          tooltip="Excalidraw"
          tooltipOptions={tooltipOptions}
          action={() => {
              if (editorDisabled) return;
              toggleVisible(true);
          }}
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
            disabled={!Excalidraw}
            onClick={save}
            type="button"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
