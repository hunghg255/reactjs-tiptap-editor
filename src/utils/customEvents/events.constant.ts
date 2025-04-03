export const EVENTS = {
  UPLOAD_IMAGE: (id: any) => `UPLOAD_IMAGE-${id}`,
  UPLOAD_VIDEO: (id: string) => `UPLOAD_VIDEO-${id}`,
  EDIT: (id: string) => `EDIT-${id}`,
  UPDATE_THEME: (id: string) => `UPDATE_THEME-${id}`,

  SEARCH_REPLCE: (id: string) => `SEARCH_REPLACE-${id}`,
} as const;

class EventName {
  private uploadImageId: string;
  private uploadVideoId: string;
  private editId: string;
  private updateThemeId: string;
  private searchReplaceId: string;

  constructor() {
    this.uploadImageId = '';
    this.uploadVideoId = '';
    this.editId = '';
    this.updateThemeId = '';
    this.searchReplaceId = '';
  }

  setEventNameUploadImage(id: string) {
    this.uploadImageId = EVENTS.UPLOAD_IMAGE(id);
  }

  getEventNameUploadImage() {
    return this.uploadImageId;
  }

  setEventNameUploadVideo(id: string) {
    this.uploadVideoId = EVENTS.UPLOAD_VIDEO(id);
  }

  getEventNameUploadVideo() {
    return this.uploadVideoId;
  }

  setEventNameEdit(id: string) {
    this.editId = EVENTS.EDIT(id);
  }

  getEventNameEdit() {
    return this.editId;
  }

  setEventNameUpdateTheme(id: string) {
    this.updateThemeId = EVENTS.UPDATE_THEME(id);
  }

  getEventNameUpdateTheme() {
    return this.updateThemeId;
  }

  setEventNameSearchReplace(id: string) {
    this.searchReplaceId = EVENTS.SEARCH_REPLCE(id);
  }

  getEventNameSearchReplace() {
    return this.searchReplaceId;
  }
}

export const eventName = new EventName();

// type EventsType = typeof EVENTS;
export type EventValues = any;
