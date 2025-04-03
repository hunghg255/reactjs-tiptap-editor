export const EVENTS = {
  UPLOAD_IMAGE: (id: any) => `UPLOAD_IMAGE-${id}`,
  UPLOAD_VIDEO: (id: string) => `UPLOAD_VIDEO-${id}`,
  EDIT: (id: string) => `EDIT-${id}`,
  UPDATE_THEME: (id: string) => `UPDATE_THEME-${id}`,

  SEARCH_REPLCE:  'SEARCH_REPLACE',
} as const;

// type EventsType = typeof EVENTS;
export type EventValues = any;
