import React, { useState } from 'react';

import {
  Color4
} from 'easydrawer';

import { cn } from '@/lib/utils';

import styles from './ControlDrawer.module.scss';
import { MingcuteDiamondSquareLine, HugeiconsCursorRectangleSelection01, IcSharpArrowRightAlt, MaterialSymbolsCircleOutline, MaterialSymbolsEdit, MaterialSymbolsHexagonOutline, MaterialSymbolsRectangleOutline, MdiFormatLetterCase, MdiSquareOutline, OuiEraser, PhHighlighter, TablerTriangle, PhLineSegmentFill, IcSharpFavorite, MaterialSymbolsKidStar, MaterialSymbolsCloud, AkarIconsParallelogram, SolarUndoLeftRoundBold, SolarUndoRightRoundBold, MaterialSymbolsDelete } from './icon';

const enum ShapeType {
  square = 0,
  rectangle = 1,
  circle = 2,
  triangle = 3,
  hexagonal = 4,
  diamond = 5,
  arrow = 6,
  line = 7,
  heart = 8,
  star = 9,
  cloud = 10,
  parallelogram = 11
}

const highlightC = [
  Color4.blackHighlight,
  Color4.ofRGBA(166/255, 81/255, 167/255, 0.3),
  Color4.ofRGBA(247/255, 78/255, 158/255, 0.3),
  Color4.ofRGBA(166/255, 83/255, 88/255, 0.3),
  Color4.ofRGBA(246/255, 130/255, 28/255, 0.3),
  Color4.ofRGBA(166/255, 198/255, 0, 0.3),
  Color4.ofRGBA(98/255, 186/255, 70/255, 0.3),
];

const COLOR = [
  Color4.black,
  Color4.fromHex('#007AFF'),
  Color4.fromHex('#A651A7'),
  Color4.fromHex('#F74E9E'),
  Color4.fromHex('#FF5358'),
  Color4.fromHex('#F6821C'),
  Color4.fromHex('#FFC600'),

  Color4.fromHex('#62BA46'),
  Color4.fromHex('#E6BFE8'),
  Color4.fromHex('#FEA3D2'),
  Color4.fromHex('#FFA0A3'),
  Color4.fromHex('#FBC276'),
  Color4.fromHex('#FFFB85'),
  Color4.fromHex('#AADC99'),
];

function ColorPickerHighlight ({ onChange }: any) {
  const [selected, setSelected] = useState(Color4.blackHighlight);

  return (
    <div className={styles.colorWrap}>
      {
        highlightC.map((color, index) => (
          <button
            key={index}
            style={{ backgroundColor: color.toHexString() }}
            className={cn(styles.color, {
              [styles.colorActive]: selected.toHexString() === color.toHexString(),
            })}
            onClick={() => {
              setSelected(color);
              onChange(color);
            }}
          >
          </button>
        ))
      }
    </div>
  );
}

function ColorPicker ({ onChange }: any) {
  const [selected, setSelected] = useState(Color4.black);

  return (
    <>
      <div className={styles.colorWrap}>
        {
          COLOR.slice(0, 7).map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color.toHexString() }}
              className={cn(styles.color, {
                [styles.colorActive]: selected.toHexString() === color.toHexString(),
              })}
              onClick={() => {
                setSelected(color);
                onChange(color);
              }}
            >
            </button>
          ))
        }
      </div>

      <div className={styles.colorWrap}>
        {
          COLOR.slice(7).map((color, index) => (
            <button
              key={index}
              style={{ backgroundColor: color.toHexString() }}
              className={cn(styles.color, {
                [styles.colorActive]: selected.toHexString() === color.toHexString(),
              })}
              onClick={() => {
                setSelected(color);
                onChange(color);
              }}
            >
            </button>
          ))
        }
      </div>
    </>
  );
}

function PencilOption({ setColorPen, setThicknessPen }: any) {
  const [thickness, setThickness] = useState(2);

  return (
    <div className={styles.options}>
      <div>
        <ColorPicker
          onChange={(color: any) => setColorPen(color)}
        />
      </div>

      <div className={styles.line}></div>

      <div>
        <input max={10}
          min={1}
          step={0.1}
          type="range"
          value={thickness}
          onChange={(e) => {
            setThicknessPen(Number.parseFloat(e.target.value));
            setThickness(Number.parseFloat(e.target.value));
          }}
        />
      </div>
    </div>
  );
}

function HighlightOption({ setColorHighlight }: any) {
  return (
    <div className={styles.options}>
      <ColorPickerHighlight
        onChange={(color: any) => setColorHighlight(color)}
      />
    </div>
  );
}

function ShapeOption({ changeColorShape, changeBorderColorShape,
  onThicknessChange
}: any) {

  return (
    <div className={styles.options}>
      <div>
        <ColorPicker
          onChange={(color: any) => changeColorShape(color)}
        />
      </div>

      <div className={styles.line}></div>

      <div>
        <ColorPicker
          onChange={(color: any) => changeBorderColorShape(color)}
        />
      </div>

      <div className={styles.line}></div>

      <div>
        <input defaultValue={0}
          max={20}
          min={0}
          step={1}
          type="range"
          // value={thickness}
          onChange={(e) => {
            onThicknessChange(Number.parseFloat(e.target.value));
          }}
        />
      </div>
    </div>
  );
}

function ControlDrawer(props: any) {
  const {
    setColorPen,
    refEditor,
    setThicknessPen,
    setColorHighlight,
    changeBorderColorShape,
    onUndo,
    changeColorShape,
    changeShape,
    onThicknessChange,
    onRedo,
    onClear,
  } = props;
  const [tool, setTool] = useState<'select' | 'text' | 'pencil' | 'highlighter' | 'eraser' | 'shapes' | null>(null);

  const [type, setType] = useState(ShapeType.square);

  return (
    <>
      <div
        className={styles.wrapper}
      >
        <div className={styles.pen}>
          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'select',
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              if (tool === 'select') {
                setTool(null);
                penTool[0].setEnabled(false);

                return;
              }
              setTool('select');
              penTool[0].setEnabled(true);
            }}
          >
            <HugeiconsCursorRectangleSelection01 />
          </button>

          <div className={styles.line}></div>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'text',
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[1]);
              if (tool === 'text') {
                penTool[1].setEnabled(false);

                setTool(null);
                return;
              }
              setTool('text');
              penTool[1].setEnabled(true);
            }}
          >
            <MdiFormatLetterCase />
          </button>

          <div className={styles.line}></div>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'pencil',
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              if (tool === 'pencil') {
                setTool(null);
                penTool[2].setEnabled(false);
                return;
              }
              setTool('pencil');
              penTool[2].setEnabled(true);
            }}
          >
            <MaterialSymbolsEdit />
          </button>

          <button

            className={cn(styles.tool, {
              [styles.active]: tool === 'highlighter',
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              if (tool === 'highlighter') {
                setTool(null);
                penTool[3].setEnabled(false);
                return;
              }
              setTool('highlighter');
              penTool[3].setEnabled(true);
            }}
          >
            <PhHighlighter />
          </button>

          <div className={styles.line}></div>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'eraser',
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              if (tool === 'eraser') {
                setTool(null);
                penTool[4].setEnabled(false);
                return;
              }
              setTool('eraser');
              penTool[4].setEnabled(true);
            }}
          >
            <OuiEraser />
          </button>

          <div className={styles.line}></div>

          <button className={cn(styles.tool, {
            [styles.active]: tool === 'shapes' && type === ShapeType.square,
          })}
          onClick={() => {
            const penTool = refEditor.current!.toolController.getPrimaryTools();

            refEditor.current!.toolController.setToolEnabled(penTool[5]);
            setTool('shapes');
            penTool[5].setEnabled(true);

            changeShape(ShapeType.square);
            setType(ShapeType.square);
          }}
          >
            <MdiSquareOutline />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.rectangle,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.rectangle);
              setType(ShapeType.rectangle);
            }}
          >
            <MaterialSymbolsRectangleOutline />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.circle,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.circle);
              setType(ShapeType.circle);
            }}
          >
            <MaterialSymbolsCircleOutline />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.triangle,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.triangle);
              setType(ShapeType.triangle);
            }}
          >
            <TablerTriangle />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.hexagonal,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.hexagonal);
              setType(ShapeType.hexagonal);
            }}
          >
            <MaterialSymbolsHexagonOutline />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.diamond,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.diamond);
              setType(ShapeType.diamond);
            }}
          >
            <MingcuteDiamondSquareLine />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.arrow,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.arrow);
              setType(ShapeType.arrow);
            }}
          >
            <IcSharpArrowRightAlt />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.line,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.line);
              setType(ShapeType.line);
            }}
          >
            <PhLineSegmentFill />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.heart,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.heart);
              setType(ShapeType.heart);
            }}
          >
            <IcSharpFavorite />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.star,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.star);
              setType(ShapeType.star);
            }}
          >
            <MaterialSymbolsKidStar />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.cloud,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.cloud);
              setType(ShapeType.cloud);
            }}
          >
            <MaterialSymbolsCloud />
          </button>

          <button
            className={cn(styles.tool, {
              [styles.active]: tool === 'shapes' && type === ShapeType.parallelogram,
            })}
            onClick={() => {
              const penTool = refEditor.current!.toolController.getPrimaryTools();

              refEditor.current!.toolController.setToolEnabled(penTool[5]);
              setTool('shapes');
              penTool[5].setEnabled(true);

              changeShape(ShapeType.parallelogram);
              setType(ShapeType.parallelogram);
            }}
          >
            <AkarIconsParallelogram />
          </button>

          <div className={styles.line}></div>

          <button
            className={cn(styles.tool)}
            onClick={onUndo}
          >
            <SolarUndoLeftRoundBold />
          </button>

          <button
            className={cn(styles.tool)}

            onClick={onRedo}

          >
            <SolarUndoRightRoundBold />
          </button>

          <button
            className={cn(styles.tool)}

            onClick={onClear}

          >
            <MaterialSymbolsDelete />
          </button>
        </div>

        <div className={styles.optionsWrap}>
          {tool === 'pencil' && <PencilOption
            setColorPen={setColorPen}
            setThicknessPen={setThicknessPen}
          />}

          {tool === 'highlighter' && <HighlightOption setColorHighlight={setColorHighlight} />}

          {tool === 'shapes' && <ShapeOption
            changeBorderColorShape={changeBorderColorShape}
            changeColorShape={changeColorShape}
            changeShape={changeShape}
            onThicknessChange={onThicknessChange}
          />}
        </div>
      </div>

    </>
  );
}

export default ControlDrawer;
