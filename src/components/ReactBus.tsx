import React from 'react';

import mitt from '@/utils/mitt';

type EditorEvents = { [key: `UPLOAD_IMAGE-${string}`]: boolean } & {
  [key: `UPLOAD_VIDEO-${string}`]: boolean;
} & {
  [key: `EXCALIDRAW-${string}`]: import('@/extensions/Excalidraw/Excalidraw').IExcalidrawAttrs;
};
const iMitt = mitt<EditorEvents>();

export const BusContext = React.createContext(iMitt);

export const useBus = () => React.useContext(BusContext);

export function useListener<K extends keyof EditorEvents>(
  fn: (event: EditorEvents[K]) => void,
  events: K[]
) {
  const bus = useBus();

  React.useEffect(() => {
    events.map((e) => bus.on(e, fn));
    return () => {
      events.map((e) => bus.off(e, fn));
    };
  }, [bus, events, fn]);
}

export const emit = iMitt.emit;

export function ReactBusProvider({ children }: { children: React.ReactNode }) {
  return <BusContext.Provider value={iMitt}>{children}</BusContext.Provider>;
}
