/* eslint-disable unicorn/no-new-array */
import React, { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  TABLE_DEFAULT_SELECTED_GRID_SIZE,
  TABLE_INIT_GRID_SIZE,
  TABLE_MAX_GRID_SIZE,
} from '@/constants';
import { isMobile } from '@/utils/is-mobile';

const createArray = (length: number) => Array.from({ length }).map((_, index) => index + 1);

interface IPropsCreateTablePopover {
  createTable: any;
  disabled: any;
  children: any;
}

export interface GridSize {
  rows: number;
  cols: number;
}

export interface CreateTablePayload extends GridSize {
  withHeaderRow: boolean;
}

const CreateTablePopover = (props: IPropsCreateTablePopover) => {
  const [withHeaderRow, setWithHeaderRow] = useState<boolean>(true);
  const [tableGridSize, setTableGridSize] = useState<GridSize>({
    rows: isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
    cols: isMobile() ? TABLE_MAX_GRID_SIZE : TABLE_INIT_GRID_SIZE,
  });

  const [selectedTableGridSize, setSelectedTableGridSize] = useState<GridSize>({
    rows: TABLE_DEFAULT_SELECTED_GRID_SIZE,
    cols: TABLE_DEFAULT_SELECTED_GRID_SIZE,
  });

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

    setSelectedTableGridSize({
      rows,
      cols,
    });
  }

  function onMouseDown(rows: number, cols: number) {
    props?.createTable({ rows, cols, withHeaderRow });
    resetTableGridSize();
  }

  function resetTableGridSize(): void {
    setWithHeaderRow(false);

    setTableGridSize({
      rows: TABLE_INIT_GRID_SIZE,
      cols: TABLE_INIT_GRID_SIZE,
    });

    setSelectedTableGridSize({
      rows: TABLE_DEFAULT_SELECTED_GRID_SIZE,
      cols: TABLE_DEFAULT_SELECTED_GRID_SIZE,
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button disabled={props?.disabled} className='m-0 p-0'>
          {props?.children}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-full !p-2' align='start' side='bottom'>
        <div className='table-grid-size-editor p-0'>
          <div className='flex flex-col flex-wrap gap-1 justify-between'>
            {createArray(tableGridSize?.rows)?.map((row: any) => {
              return (
                <div key={`r-${row}`} className='flex gap-1'>
                  {createArray(tableGridSize?.cols)?.map((col: any) => {
                    return (
                      <div
                        key={`c-${col}`}
                        className={`pa-1 cursor-pointer border-border ${
                          col <= selectedTableGridSize.cols &&
                          row <= selectedTableGridSize.rows &&
                          'bg-foreground'
                        }`}
                        onMouseOver={() => selectTableGridSize(row, col)}
                        onMouseDown={() => onMouseDown(row, col)}
                      >
                        <div className='w-4 h-4 p-1 border rounded-[2px] box-border border-solid'></div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className='text-center text-sm text-zinc-600 mt-2'>
            {selectedTableGridSize.rows} x {selectedTableGridSize.cols}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateTablePopover;
