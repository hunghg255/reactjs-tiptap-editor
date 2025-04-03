export const EVENTS = {
  UPLOAD_IMAGE: 'UPLOAD_IMAGE',
  UPLOAD_VIDEO: 'UPLOAD_VIDEO',
  EDIT: 'EDIT',
  UPDATE_THEME: 'UPDATE_THEME',

  UPDATE_LANG: 'UPDATE_LANG',
} as const;

type EventsType = typeof EVENTS;
export type EventValues = EventsType[keyof EventsType];
