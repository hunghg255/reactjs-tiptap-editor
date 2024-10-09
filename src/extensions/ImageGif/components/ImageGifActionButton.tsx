/* eslint-disable no-console */
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { ActionButton, Input, Popover, PopoverContent, PopoverTrigger } from '@/components'

interface IProps {
  showClear?: boolean
  selectImage: (arg: string) => void
  children: React.ReactNode
  giphyApiKey: string
}

function ImageGifWrap({ selectImage, giphyApiKey, children }: IProps) {
  const [gifs, setGifs] = useState([])
  const [limit] = useState(10)
  const [term, setTerm] = useState('')

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
      // console.log(response);
    })
      .catch((error) => {
        // handle error
        console.log(error)
      })
  }

  useEffect(() => {
    search('', 'trend')
  }, [])

  const onSearchSubmit = (e: any) => {
    if (e.key !== 'Enter') {
      return
    }

    // @ts-ignore
    const term = inputRef.current.value

    search(term)
  }

  // const limitSubmit = (limit: any) => {
  //   setLimit(limit)
  // }

  const handleChange = (e: any) => {
    const term = e.target.value
    setTerm(term)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent hideWhenDetached className="richtext-w-full richtext-h-full richtext-p-2" align="start" side="bottom">

        {
          giphyApiKey
            ? (
                <>
                  <div className="richtext-flex richtext-w-full richtext-max-w-sm richtext-items-center richtext-gap-1.5 richtext-mb-[10px]">
                    <div className="richtext-relative richtext-items-center richtext-w-full richtext-max-w-sm">
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Search GIF"
                        value={term}
                        onChange={handleChange}
                        onKeyDown={onSearchSubmit}
                      />
                    </div>
                  </div>

                  <div className="richtext-max-h-[280px] richtext-overflow-y-auto">
                    <div className="richtext-grid richtext-grid-cols-2 richtext-gap-1 ">
                      {gifs?.map((o: any) => (
                        <img
                          alt="giphy"
                          key={`giphy-${o.id}`}
                          className="richtext-text-center richtext-cursor-pointer"
                          onClick={_e => selectImage(o)}
                          height={o.images.fixed_width_downsampled.height}
                          width={o.images.fixed_width_downsampled.width}
                          src={o.images.fixed_width_downsampled.url}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )
            : <div>Missing Giphy API Key</div>
        }
      </PopoverContent>
    </Popover>
  )
}

export function ImageGifActionButton({ editor, icon, giphyApiKey, ...props }: any) {
  const selectImage = (giphyblock: any) => {
    const { url } = giphyblock.images.original

    editor.chain().focus().setImage({ src: url }).run()
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
