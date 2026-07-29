import React, { useRef, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components';
import {
  TABLE_DEFAULT_SELECTED_GRID_SIZE,
  TABLE_INIT_GRID_SIZE,
  TABLE_MAX_GRID_SIZE,
} from '@/constants';
import { isMobile } from '@/utils/is-mobile';

const createArray = (length: number) => Array.from({ length }).map((_, index) => index + 1);

interface IPropsCreateTablePopover {
  createTable: any;
  children: any;
  dataState?: any;
}

interface GridSize {
  rows: number;
  cols: number;
}

function CreateTablePopover(props: IPropsCreateTablePopover) {
  const [open, setOpen] = useState(false);
  const activePointerId = useRef<number | null>(null);

  const [withHeaderRow, setWithHeaderRow] = useState<boolean>(true);
  const [tableGridSize, setTableGridSize] = useState<GridSize>({
    rows: isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
    cols: isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
  });

  const [selectedTableGridSize, setSelectedTableGridSize] = useState<GridSize>({
    rows: TABLE_DEFAULT_SELECTED_GRID_SIZE,
    cols: TABLE_DEFAULT_SELECTED_GRID_SIZE,
  });
  const selectedTableGridSizeRef = useRef(selectedTableGridSize);

  function selectTableGridSize(rows: number, cols: number): void {
    if (rows === tableGridSize.rows) {
      setTableGridSize((prev) => {
        return {
          ...prev,
          rows: Math.min(rows + 1, TABLE_MAX_GRID_SIZE),
        };
      });
    }

    if (cols === tableGridSize.cols) {
      setTableGridSize((prev) => {
        return {
          ...prev,
          cols: Math.min(cols + 1, TABLE_MAX_GRID_SIZE),
        };
      });
    }

    const nextGridSize = {
      rows,
      cols,
    };
    selectedTableGridSizeRef.current = nextGridSize;
    setSelectedTableGridSize(nextGridSize);
  }

  function createSelectedTable() {
    const { rows, cols } = selectedTableGridSizeRef.current;
    props?.createTable({ rows, cols, withHeaderRow });
    resetTableGridSize();
    setOpen(false);
  }

  function getGridCell(event: React.PointerEvent<HTMLDivElement>): HTMLElement | null {
    const directTarget =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-table-grid-cell]')
        : null;

    if (directTarget) {
      return directTarget;
    }

    const elementAtPointer = document.elementFromPoint(event.clientX, event.clientY);
    return elementAtPointer?.closest<HTMLElement>('[data-table-grid-cell]') ?? null;
  }

  function selectGridCellFromPointer(event: React.PointerEvent<HTMLDivElement>): boolean {
    const gridCell = getGridCell(event);
    if (!gridCell || !event.currentTarget.contains(gridCell)) {
      return false;
    }

    const rows = Number(gridCell.dataset.rows);
    const cols = Number(gridCell.dataset.cols);
    if (Number.isNaN(rows) || Number.isNaN(cols)) {
      return false;
    }

    selectTableGridSize(rows, cols);
    return true;
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    if (!selectGridCellFromPointer(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    activePointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== null && activePointerId.current !== event.pointerId) {
      return;
    }

    if (activePointerId.current !== null) {
      event.preventDefault();
      event.stopPropagation();
    }

    selectGridCellFromPointer(event);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== event.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    selectGridCellFromPointer(event);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activePointerId.current = null;
    createSelectedTable();
  }

  function onPointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activePointerId.current = null;
  }

  function resetTableGridSize(): void {
    setWithHeaderRow(false);

    setTableGridSize({
      rows: TABLE_INIT_GRID_SIZE,
      cols: TABLE_INIT_GRID_SIZE,
    });

    const defaultSelectedGridSize = {
      rows: TABLE_DEFAULT_SELECTED_GRID_SIZE,
      cols: TABLE_DEFAULT_SELECTED_GRID_SIZE,
    };
    selectedTableGridSizeRef.current = defaultSelectedGridSize;
    setSelectedTableGridSize(defaultSelectedGridSize);
  }

  return (
    <Popover modal onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild data-state={props?.dataState ? 'on' : 'off'}>
        {props?.children}
      </PopoverTrigger>

      <PopoverContent align='start' className='richtext-w-full !richtext-p-2' side='bottom'>
        <div className='table-grid-size-editor richtext-p-0'>
          <div
            className='richtext-flex richtext-flex-col richtext-flex-wrap richtext-justify-between richtext-gap-1'
            onPointerCancel={onPointerCancel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{ touchAction: 'none' }}
          >
            {createArray(tableGridSize?.rows)?.map((row: any) => {
              return (
                <div className='richtext-flex richtext-gap-1' key={`richtext-table-row-${row}`}>
                  {createArray(tableGridSize?.cols)?.map((col: any) => {
                    return (
                      <div
                        data-cols={col}
                        data-rows={row}
                        data-table-grid-cell
                        key={`richtext-table-col-${col}`}
                        className={`richtext-cursor-pointer richtext-border-border ${
                          col <= selectedTableGridSize.cols &&
                          row <= selectedTableGridSize.rows &&
                          'tableCellActive !richtext-bg-foreground'
                        }`}
                      >
                        <div className='richtext-box-border richtext-size-4 richtext-rounded-[2px] !richtext-border richtext-border-solid !richtext-border-border richtext-p-1'></div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className='richtext-mt-2 richtext-text-center richtext-text-sm richtext-text-foreground'>
            {selectedTableGridSize.rows}x{selectedTableGridSize.cols}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CreateTablePopover;
