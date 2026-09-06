import type { BaseTool, BaseWidget, Color4, Editor } from 'easydrawer';
import type { RefObject } from 'react';

/** Shape methods exposed by easydrawer's runtime but omitted from its declarations. */
export interface DrawingTool extends BaseTool {
  setColor(color: Color4): void;
  setThickness(thickness: number): void;
  setBorderColor(color: Color4): void;
}
export interface ShapeWidget extends BaseWidget {
  setShapeType(type: number): void;
}
export interface ControlDrawerProps {
  refEditor: RefObject<Editor | null>;
  setColorPen: (color: Color4) => void;
  setThicknessPen: (thickness: number) => void;
  setColorHighlight: (color: Color4) => void;
  changeColorShape: (color: Color4) => void;
  changeBorderColorShape: (color: Color4) => void;
  changeShape: (type: number) => void;
  onThicknessChange: (thickness: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}
