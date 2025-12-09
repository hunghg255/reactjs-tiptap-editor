export const EVENTS = {
  UPLOAD_IMAGE: (id: any) => `UPLOAD_IMAGE-${id}`,
  UPLOAD_VIDEO: (id: string) => `UPLOAD_VIDEO-${id}`,

  CHANGE_THEME: 'CHANGE_THEME',
  CHANGE_COLOR: 'CHANGE_COLOR',
  CHANGE_BORDER_RADIUS: 'CHANGE_BORDER_RADIUS',
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
} as const;

// type EventsType = typeof EVENTS;
export type EventValues = any;
