export const EVENTS = {
  UPLOAD_IMAGE: (id: any) => `UPLOAD_IMAGE-${id}`,
  UPLOAD_VIDEO: (id: string) => `UPLOAD_VIDEO-${id}`,
  UPDATE_THEME: (id: string) => `UPDATE_THEME-${id}`,

  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
} as const;

// type EventsType = typeof EVENTS;
export type EventValues = any;
