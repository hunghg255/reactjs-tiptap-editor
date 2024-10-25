/* eslint-disable ts/no-unused-expressions */
import { useCallback, useEffect, useState } from 'react'

import type { Editor } from '@tiptap/core'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ActionButton } from '@/components/ActionButton'
import { Button } from '@/components/ui'
import { OPEN_EXCALIDRAW_SETTING_MODAL, cancelSubject, subject } from '@/utils/_event'

interface IProps { editor: Editor }

export const ExcalidrawActiveButton: React.FC<IProps> = ({ editor }) => {
  const [Excalidraw, setExcalidraw] = useState<any>(null)
  const [data, setData] = useState({})
  const [initialData, setInitialData] = useState({ elements: [], appState: { isLoading: false }, files: null })
  const [visible, toggleVisible] = useState(false)
  const [loading, toggleLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const renderEditor = useCallback(
    (div: any) => {
      if (!div)
        return

      import('@excalidraw/excalidraw')
        .then((res) => {
          setExcalidraw(res.Excalidraw)
        })
        .catch(setError)
        .finally(() => toggleLoading(false))
    },
    [toggleLoading],
  )

  const renderExcalidraw: any = useCallback((app: any) => {
    setTimeout(() => {
      app.refresh()
    })
  }, [])

  const onChange = useCallback((elements: any, appState: any, files: any) => {
    // appState.collaborators = [];
    setData({
      elements,
      appState: { isLoading: false },
      files,
    })
  }, [])

  const save = useCallback(() => {
    if (!Excalidraw) {
      toggleVisible(false)
      return
    }

    // const currentScrollTop = document.querySelector('main#js-tocs-container')?.scrollTop
    editor.chain().focus().setExcalidraw({ data }).run()
    // setTimeout(() => {
    //   // @ts-expect-error
    //   document.querySelector('main#js-tocs-container').scrollTop = currentScrollTop
    // })
    toggleVisible(false)
  }, [Excalidraw, editor, data, toggleVisible])

  useEffect(() => {
    const handler = (data: any) => {
      toggleVisible(true)
      data && setInitialData(data.data)
    }

    subject(OPEN_EXCALIDRAW_SETTING_MODAL, handler)

    return () => {
      cancelSubject(OPEN_EXCALIDRAW_SETTING_MODAL, handler)
    }
  }, [editor, toggleVisible])

  return (
    <Dialog
      open={visible}
      onOpenChange={toggleVisible}
    >
      <DialogTrigger asChild>
        <ActionButton
          icon="Excalidraw"
          tooltip="Excalidraw"
          action={() => toggleVisible(true)}
        />
      </DialogTrigger>
      <DialogContent className="!richtext-max-w-[1300px] richtext-z-[99999]">
        <DialogTitle>Excalidraw</DialogTitle>

        <div style={{ height: '100%', borderWidth: 1 }}>
          {loading && (
            <p>
              Loading...
            </p>
          )}

          {error && <p>{(error && error.message) || 'Error'}</p>}

          <div style={{ width: '100%', height: 600 }} ref={renderEditor}>
            {!loading && !error && Excalidraw
              ? (
                  <Excalidraw ref={renderExcalidraw} onChange={onChange} langCode="en" initialData={initialData} />
                )
              : null}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={save}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
