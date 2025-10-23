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
import ControlDrawer from '@/extensions/Drawer/components/ControlDrawer/ControlDrawer';
import { dataURLtoFile } from '@/utils/file';
import { shortId } from '@/utils/shortId';
import type { TooltipContentProps } from '@radix-ui/react-tooltip';

interface IProps {
  editor: Editor, upload?: any, tooltipOptions?: TooltipContentProps
}

let clear = false;

export const DrawerActiveButton: React.FC<IProps> = ({ editor, upload, tooltipOptions }) => {
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

  const setColorPen = (color: string) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[2] as any;
    const shapeWidget = refWidget.current.getWidgetById('pen-1');

    if (penTool && shapeWidget) {
      penTool.setColor(color);
      shapeWidget.serializeState();
    }
  };

  const setThicknessPen = (thickness: number) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[2] as any;
    const shapeWidget = refWidget.current.getWidgetById('pen-1');

    if (penTool && shapeWidget) {
      penTool.setThickness(thickness);
      shapeWidget.serializeState();
    }
  };

  const setColorHighlight = (color: string) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[3] as any;

    const shapeWidget = refWidget.current.getWidgetById('pen-2');

    if (penTool && shapeWidget) {
      penTool.setColor(color);
      shapeWidget.serializeState();
    }
  };

  const changeShape = (type: any) => {
    const shapeWidget = refWidget.current.getWidgetById('shape');

    if (shapeWidget) {
      shapeWidget.setShapeType(type);
    }
  };

  const changeColorShape = (color: string) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[5] as any;
    const shapeWidget = refWidget.current.getWidgetById('shape');

    if (penTool && shapeWidget) {
      penTool.setColor(color);
      shapeWidget.serializeState();
    }
  };

  const onThicknessChange = (v: any) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[5] as any;
    const shapeWidget = refWidget.current.getWidgetById('shape');

    if (penTool && shapeWidget) {
      penTool.setThickness(v);
      shapeWidget.serializeState();
    }
  };

  const changeBorderColorShape = (color: string) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[5] as any;
    const shapeWidget = refWidget.current.getWidgetById('shape');

    if (penTool && shapeWidget) {
      penTool.setBorderColor(color);
      shapeWidget.serializeState();
    }
  };

  const onUndo =() => {
    if (clear) {
      while (refEditor.current!.history.redoStackSize > 0) {
        refEditor.current!.history.redo();
      }
      clear = false;
      return;
    }

    refEditor.current!.history.undo();
  };

  const onRedo =() => {
    if (clear) {
      return;
    }

    refEditor.current!.history.redo();
  };

  const onClear =() => {
    if (clear) {
      return;
    }

    while (refEditor.current!.history.undoStackSize > 0) {
      onUndo();
    }
    clear = true;
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
          tooltipOptions={tooltipOptions}
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

          <ControlDrawer
            changeBorderColorShape={changeBorderColorShape}
            changeColorShape={changeColorShape}
            changeShape={changeShape}
            onClear={onClear}
            onRedo={onRedo}
            onThicknessChange={onThicknessChange}
            onUndo={onUndo}
            refEditor={refEditor}
            setColorHighlight={setColorHighlight}
            setColorPen={setColorPen}
            setThicknessPen={setThicknessPen}
          />
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
