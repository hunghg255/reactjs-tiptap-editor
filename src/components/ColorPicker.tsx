import React, { useEffect, useMemo, useState } from 'react';

import { Plus } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import { Button, Input, Popover, PopoverContent, PopoverTrigger, Separator } from '@/components';
import { NoFill } from '@/components/icons/NoFill';
import { COLORS_LIST as DEFAULT_COLORS_LIST } from '@/constants';
import { useLocale } from '@/locales';

export interface ColorPickerProps {
  highlight?: boolean
  disabled?: boolean
  colors?: string[]
  defaultColor?: string
  children: React.ReactNode
  onChange?: (color: string | undefined) => void
  setSelectedColor?: (color: string | undefined) => void
  selectedColor?: string
}

function ColorPicker(props: ColorPickerProps) {
  const { t } = useLocale();

  const {
    highlight = false,
    disabled = false,
    selectedColor,
    setSelectedColor,
    onChange,
    colors = DEFAULT_COLORS_LIST,
  } = props;

  const chunkedColors = useMemo(() => {
    const colorsArray = colors;
    const chunked: string[][] = [];
    for (let i = 0; i < colorsArray.length; i += 10) {
      chunked.push(colorsArray.slice(i, i + 10));
    }
    return chunked;
  }, [colors]);

  const [recentColorsStore, setRecentColorsStore] = useState<string[]>([]);

  const setRecentColor = (color: string) => {
    const newRecentColors = [...recentColorsStore];
    const index = newRecentColors.indexOf(color);
    if (index !== -1) {
      newRecentColors.splice(index, 1);
    }
    newRecentColors.unshift(color);
    if (newRecentColors.length > 10) {
      newRecentColors.pop();
    }
    setRecentColorsStore(newRecentColors);
  };

  function setColor(color: string | undefined) {
    if (color === undefined) {
      // clear color
      setSelectedColor?.(color);
      onChange?.(color);
      return;
    }
    // check if color is correct
    const isCorrectColor = /^#([\da-f]{3}){1,2}$/i.test(color);
    if (isCorrectColor) {
      setSelectedColor?.(color);
      onChange?.(color);
      setRecentColor(color);
    }
  }

  return (
    <Popover modal>
      <PopoverTrigger asChild
        className="!richtext-p-0"
        disabled={disabled}
      >
        {props?.children}
      </PopoverTrigger>

      <PopoverContent align="start"
        className="richtext-size-full richtext-p-2"
        hideWhenDetached
        side="bottom"
      >
        <div className="richtext-flex richtext-flex-col">
          {highlight
            ? (
              <div
                className="rd-1 richtext-flex richtext-cursor-pointer richtext-items-center richtext-gap-[4px] richtext-p-1 hover:richtext-bg-accent"
                onClick={() => setColor(undefined)}
              >
                <NoFill />

                <span className="richtext-ml-1 richtext-text-sm">
                  {t('editor.nofill')}
                </span>
              </div>
            )
            : (
              <div
                className="rd-1 richtext-flex richtext-cursor-pointer richtext-items-center richtext-gap-[4px] richtext-p-1 hover:richtext-bg-accent"
                onClick={() => {
                  setColor(undefined);
                }}
              >
                <NoFill />

                <span className="richtext-ml-1 richtext-text-sm">
                  {t('editor.default')}
                </span>
              </div>
            )}

          {chunkedColors.map((items: string[], index: number) => {
            return (
              <span className="richtext-relative richtext-flex richtext-h-auto richtext-w-full richtext-p-0 last:richtext-pb-2"
                key={index}
              >
                {items.map((item: string, idx) => {
                  return (
                    <span
                      className="richtext-inline-block richtext-size-6 richtext-flex-[0_0_auto] richtext-cursor-pointer richtext-rounded-sm !richtext-border richtext-border-transparent richtext-p-0.5 hover:richtext-border-border hover:richtext-shadow-sm"
                      key={`sub-color-${idx}`}
                      onClick={() => setColor(item)}
                    >
                      <span
                        className="richtext-relative richtext-block richtext-size-[18px] richtext-rounded-[2px] richtext-border-transparent"
                        style={{
                          backgroundColor: item,
                        }}
                      >
                        {item === selectedColor
                          ? (
                            <svg
                              className="richtext-absolute -richtext-top-px richtext-left-px richtext-block richtext-size-3"
                              viewBox="0 0 18 18"
                              style={{
                                fill: 'rgb(255, 255, 255)',
                              }}
                            >
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                            </svg>
                          )
                          : (
                            <svg
                              viewBox="0 0 18 18"
                              style={{
                                fill: 'rgb(255, 255, 255)',
                                display: 'none',
                              }}
                            >
                              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                            </svg>
                          )}
                      </span>
                    </span>
                  );
                })}
              </span>
            );
          })}

          <div>
            <div className="richtext-my-1 richtext-text-sm">
              {t('editor.recent')}
            </div>

            <span className="richtext-relative richtext-flex richtext-h-auto richtext-w-full richtext-p-0 last:richtext-pb-2">
              {recentColorsStore?.map((item, index) => {
                return (
                  <span
                    className="richtext-inline-block richtext-size-6 richtext-flex-[0_0_auto] richtext-cursor-pointer richtext-rounded-sm !richtext-border richtext-border-transparent richtext-p-0.5 hover:richtext-border-border hover:richtext-shadow-sm"
                    key={`sub-color-recent-${index}`}
                    onClick={() => setColor(item)}
                  >
                    <span
                      className="richtext-relative richtext-block richtext-size-[18px] richtext-rounded-[2px] richtext-border-transparent"
                      style={{
                        backgroundColor: item,
                      }}
                    >
                      <svg
                        viewBox="0 0 18 18"
                        style={{
                          fill: 'rgb(255, 255, 255)',
                          display: 'none',
                        }}
                      >
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path>
                      </svg>
                    </span>
                  </span>
                );
              })}
            </span>
          </div>

          <AddMoreColor setColor={setColor} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface AddMoreColorProps {
  setColor: (color: string) => void
}

function AddMoreColor({ setColor }: AddMoreColorProps) {
  const [colorMore, setColorMore] = useState('#000000');
  const [openColorMore, setOpenColorMore] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    return () => {
      setOpenColorMore(false);
    };
  }, []);

  return (
    <Popover open={openColorMore}>
      <PopoverTrigger asChild>
        <div
          className="richtext-p-1.5 richtext-text-sm hover:richtext-cursor-pointer hover:richtext-bg-accent"
          onClick={(e) => {
            e.preventDefault();
            setOpenColorMore(true);
          }}
        >
          {t('editor.color.more')}
          ...
        </div>
      </PopoverTrigger>

      <PopoverContent>
        <div className="richtext-flex richtext-flex-col richtext-items-center richtext-justify-center">
          <HexColorPicker color={colorMore}
            onChange={setColorMore}
          />

          <Input
            className="richtext-mt-[8px] richtext-w-full"
            type="text"
            value={colorMore.slice(1)}
            onChange={(e) => {
              e.preventDefault();
              setColorMore(`#${e.target.value}`);
            }}
          />
        </div>

        <Separator className="richtext-my-[10px]" />

        <Button
          className="richtext-w-full"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setColor(colorMore);
            setOpenColorMore(false);
          }}
        >
          <Plus size={16} />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export { ColorPicker };
