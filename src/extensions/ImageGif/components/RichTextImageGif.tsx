import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { debounce } from 'lodash-es';

import { ActionButton, Input, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { type GifItem, serviceGetTrendingGiphy, serviceGetTrendingTenor, serviceSearchGiphy, serviceSearchTenor } from '@/extensions/ImageGif/components/services';
import { ImageGif } from '@/extensions/ImageGif/ImageGif';
import { useToggleActive } from '@/hooks/useActive';
import { useButtonProps } from '@/hooks/useButtonProps';

interface IProps {
  showClear?: boolean
  selectImage: (arg: string) => void
  children: React.ReactNode
  apiKey: string
  provider: string;
}

function useServiceGif (provider: string, apiKey: string) {

  const searchTrending = async (): Promise<GifItem[]> => {
    if (!apiKey) return [];

    if (provider === 'giphy') {
      return serviceGetTrendingGiphy(apiKey);
    }

    if (provider === 'tenor') {
      return serviceGetTrendingTenor(apiKey);
    }

    return [];
  };

  const searchWord = async (word: string): Promise<GifItem[]> => {
    if (!apiKey) return [];

    if (provider === 'giphy') {
      return serviceSearchGiphy(word, apiKey);
    }

    if (provider === 'tenor') {
      return serviceSearchTenor(word, apiKey);
    }

    return [];
  };

return {
  searchTrending,
  searchWord
};
}

function ImageGifWrap({ selectImage, apiKey, provider, children }: IProps) {
  const [open, setOpen] = useState(false);
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const { editorDisabled } = useToggleActive();
  const inputRef = useRef(null);

  const { searchTrending, searchWord } = useServiceGif(provider, apiKey);

  useEffect(() => {
    (async () => {
      const r = await searchTrending();
      setGifs(r);
    })();
  }, []);

  const handleInputChange = useCallback(
    debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value) {
        const r = await searchTrending();
        setGifs(r);
        return;
      }
      // Add your logic here
      const r = await  searchWord(event.target.value);
      setGifs(r);
    }, 350), // Adjust the debounce delay as needed
    [],
  );

  return (
    <Popover
      modal
      onOpenChange={setOpen}
      open={open}
    >
      <PopoverTrigger asChild
disabled={editorDisabled}
      >
        {children}
      </PopoverTrigger>

      <PopoverContent align="start"
        className="richtext-size-full richtext-p-2"
        hideWhenDetached
        side="bottom"
      >

        {
          apiKey
            ? (
              <>
                <div className="richtext-mb-[10px] richtext-w-full">
                  <Input
                    onChange={handleInputChange}
                    placeholder="Search GIF"
                    ref={inputRef}
                    type="text"
                  />
                </div>

                <div className="richtext-max-h-[280px] !richtext-max-w-[400px] richtext-overflow-y-auto">
                  <div className="richtext-grid richtext-grid-cols-2 richtext-gap-1 ">

                    {gifs?.length
                      ? gifs?.map((item) => (
                        <img
                          alt=''
                          className="richtext-cursor-pointer richtext-object-contain richtext-text-center"
                          key={item.id}
                          src={item.src}
                          onClick={() => {
                            selectImage(item.src);
                            setOpen(false);
                          }}
                        />
                      ))
                      : <p>
                        No GIFs found
                      </p>}
                  </div>
                </div>
              </>
            )
            : (
              <div>
                <p>
                  Missing Giphy API Key
                </p>
              </div>
            )
        }
      </PopoverContent>
    </Popover>
  );
}

export function RichTextImageGif() {
  const buttonProps = useButtonProps(ImageGif.name);

  const {
    action,
    icon,
    tooltip,
    apiKey,
    provider,
  } = buttonProps?.componentProps ?? {};

  const { editorDisabled } = useToggleActive();

  const selectImage = (src: string) => {
    if (editorDisabled) return;

    if (action) {
      action(src);
    }
  };

  return (
    <ImageGifWrap
      apiKey={apiKey}
      provider={provider}
      selectImage={selectImage}
    >
      <ActionButton
        disabled={editorDisabled}
        icon={icon}
        tooltip={tooltip}
      />
    </ImageGifWrap>
  );
}
