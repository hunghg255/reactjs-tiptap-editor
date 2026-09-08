import { makeDropdownToolbar, Editor as Editor4 } from 'easydrawer';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

import ControlDrawer from './ControlDrawer/ControlDrawer';

import type { DrawingTool, ShapeWidget } from '../types';
import type { Color4, PenTool } from 'easydrawer';

export interface DrawerCanvasProps {
  initialSvg?: string;
  onSave: (svg: string) => Promise<void>;
}

export default function DrawerCanvas({ initialSvg, onSave }: DrawerCanvasProps) {
  const host = useRef<HTMLDivElement>(null);
  const refEditor = useRef<Editor4 | null>(null);
  const refWidget = useRef<ReturnType<typeof makeDropdownToolbar> | null>(null);
  const cleared = useRef(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!host.current) return;
    let cancelled = false;
    const drawing = new Editor4(host.current, { wheelEventsEnabled: false, disableZoom: true });
    const toolbar = makeDropdownToolbar(drawing);
    refEditor.current = drawing;
    refWidget.current = toolbar;
    toolbar.addDefaultToolWidgets();
    cleared.current = false;
    setReady(false);
    setError('');

    async function initialize() {
      try {
        if (initialSvg) await drawing.loadFromSVG(decodeURIComponent(initialSvg));
        if (!cancelled) setReady(true);
      } catch (error) {
        if (!cancelled) setError(String(error));
      }
    }
    void initialize();
    return () => {
      cancelled = true;
      toolbar.remove();
      drawing.remove();
      refEditor.current = null;
      refWidget.current = null;
    };
  }, [initialSvg]);

  async function save() {
    if (!refEditor.current || !ready || saving) return;
    setSaving(true);
    setError('');
    try {
      await onSave(refEditor.current.toSVG().outerHTML);
    } catch (error) {
      setError(String(error));
    } finally {
      setSaving(false);
    }
  }

  const setColorPen = (color: Color4) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[2] as PenTool;
    const shapeWidget = refWidget.current?.getWidgetById('pen-1');

    if (penTool && shapeWidget) {
      penTool.setColor(color);
      shapeWidget.serializeState();
    }
  };

  const setThicknessPen = (thickness: number) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[2] as PenTool;
    const shapeWidget = refWidget.current?.getWidgetById('pen-1');

    if (penTool && shapeWidget) {
      penTool.setThickness(thickness);
      shapeWidget.serializeState();
    }
  };

  const setColorHighlight = (color: Color4) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[3] as PenTool;

    const shapeWidget = refWidget.current?.getWidgetById('pen-2');

    if (penTool && shapeWidget) {
      penTool.setColor(color);
      shapeWidget.serializeState();
    }
  };

  const changeShape = (type: number) => {
    const shapeWidget = refWidget.current?.getWidgetById('shape') as ShapeWidget | undefined;

    if (shapeWidget) {
      shapeWidget.setShapeType(type);
    }
  };

  const changeColorShape = (color: Color4) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[5] as DrawingTool;
    const shapeWidget = refWidget.current?.getWidgetById('shape') as ShapeWidget | undefined;

    if (penTool && shapeWidget) {
      penTool.setColor(color);
      shapeWidget.serializeState();
    }
  };

  const onThicknessChange = (v: number) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[5] as DrawingTool;
    const shapeWidget = refWidget.current?.getWidgetById('shape') as ShapeWidget | undefined;

    if (penTool && shapeWidget) {
      penTool.setThickness(v);
      shapeWidget.serializeState();
    }
  };

  const changeBorderColorShape = (color: Color4) => {
    const penTool = refEditor.current!.toolController.getPrimaryTools()[5] as DrawingTool;
    const shapeWidget = refWidget.current?.getWidgetById('shape') as ShapeWidget | undefined;

    if (penTool && shapeWidget) {
      penTool.setBorderColor(color);
      shapeWidget.serializeState();
    }
  };

  const onUndo = () => {
    if (cleared.current) {
      while (refEditor.current!.history.redoStackSize > 0) {
        refEditor.current!.history.redo();
      }
      cleared.current = false;
      return;
    }

    refEditor.current!.history.undo();
  };

  const onRedo = () => {
    if (cleared.current) {
      return;
    }

    refEditor.current!.history.redo();
  };

  const onClear = () => {
    if (cleared.current) {
      return;
    }

    while (refEditor.current!.history.undoStackSize > 0) {
      onUndo();
    }
    cleared.current = true;
  };

  return (
    <>
      <div
        style={{
          height: '600px',
          width: '100%',
          borderWidth: 1,
          background: 'white',
          position: 'relative',
        }}
      >
        <div className='richtext-size-full' ref={host} />
        {ready && (
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
        )}
      </div>
      {error && <p role='alert'>{error}</p>}
      <DialogFooter>
        <Button disabled={!ready || saving} onClick={() => void save()} type='button'>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogFooter>
    </>
  );
}
