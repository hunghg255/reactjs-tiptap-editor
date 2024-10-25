/* eslint-disable no-console */
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { debounce } from 'lodash-es'
import { ActionButton, Input, Popover, PopoverContent, PopoverTrigger } from '@/components'

interface IProps {
  showClear?: boolean
  selectImage: (arg: string) => void
  children: React.ReactNode
  giphyApiKey: string
}

function ImageGifWrap({ selectImage, giphyApiKey, children }: IProps) {
  const [gifs, setGifs] = useState([])
  const [limit] = useState(15)

  const inputRef = useRef(null)

  const search = (term: any, kind: any = 'search') => {
    if (!giphyApiKey) {
      return
    }

    const url
      = kind === 'search'
        ? `https://api.giphy.com/v1/gifs/search?q=${term}`
        : `https://api.giphy.com/v1/gifs/trending?q=${term}`
    const link = `${url}&limit=${limit}&api_key=${giphyApiKey}`

    fetch(link).then(r => r.json()).then((response) => {
      // handle success
      setGifs(response.data)
    })
      .catch((error) => {
        // handle error
        console.log(error)
      })
  }

  useEffect(() => {
    search('', 'trend')
  }, [])

  const handleInputChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value) {
        search('', 'trend')
        return
      }
      // Add your logic here
      search(event.target.value)
    }, 350), // Adjust the debounce delay as needed
    [],
  )

  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent hideWhenDetached className="richtext-w-full richtext-h-full richtext-p-2" align="start" side="bottom">

        {
          giphyApiKey
            ? (
                <>
                  <div className="richtext-w-full richtext-mb-[10px]">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search GIF"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="richtext-max-h-[280px] richtext-overflow-y-auto">
                    <div className="richtext-grid richtext-grid-cols-2 richtext-gap-1 ">

                      {gifs?.length
                        ? gifs?.map((o: any) => (
                          <img
                            alt="giphy"
                            key={`giphy-${o.id}`}
                            className="richtext-text-center richtext-cursor-pointer"
                            onClick={_e => selectImage(o)}
                            height={o.images.fixed_width_downsampled.height}
                            width={o.images.fixed_width_downsampled.width}
                            src={o.images.fixed_width_downsampled.url}
                          />
                        ))
                        : <p>No GIFs found</p>}
                    </div>
                  </div>
                </>
              )
            : (
                <div>
                  <p>Missing Giphy API Key</p>
                </div>
              )
        }
      </PopoverContent>
    </Popover>
  )
}

export function ImageGifActionButton({ editor, icon, giphyApiKey, ...props }: any) {
  const selectImage = (giphyblock: any) => {
    const { url } = giphyblock.images.original

    editor.chain().focus().setImageGif({ src: url }).run()
  }

  return (
    <ImageGifWrap
      selectImage={selectImage}
      giphyApiKey={giphyApiKey}
    >
      <ActionButton
        tooltip={props?.tooltip}
        icon={icon}
      />
    </ImageGifWrap>
  )
}

export default ImageGifActionButton
