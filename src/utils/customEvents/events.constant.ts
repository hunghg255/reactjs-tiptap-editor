export const EVENTS = {
  UPLOAD_IMAGE: (id: string | undefined) => `UPLOAD_IMAGE-${id}` as const,
  UPLOAD_VIDEO: (id: string | undefined) => `UPLOAD_VIDEO-${id}` as const,

  EXCALIDRAW: (id: string | undefined) => `EXCALIDRAW-${id}` as const,
} as const;

// type EventsType = typeof EVENTS;
export type EventValues = ReturnType<(typeof EVENTS)[keyof typeof EVENTS]>;
