import mitt from '@/utils/mitt';

let event: any;
function getEventEmitter() {
  try {
    if (!event) {
      event = mitt();
    }
    return event;
  } catch {
    throw new Error('Error EventEmitter');
  }
}

export const OPEN_COUNT_SETTING_MODAL = 'OPEN_COUNT_SETTING_MODAL';
export const OPEN_LINK_SETTING_MODAL = 'OPEN_LINK_SETTING_MODAL';
export const OPEN_FLOW_SETTING_MODAL = 'OPEN_FLOW_SETTING_MODAL';
export const OPEN_MIND_SETTING_MODAL = 'OPEN_MIND_SETTING_MODAL';
export const OPEN_EXCALIDRAW_SETTING_MODAL = 'OPEN_EXCALIDRAW_SETTING_MODAL';
export const OPEN_DRAWER_SETTING_MODAL = 'OPEN_DRAWER_SETTING_MODAL';

export function subject(eventName: any, handler: any) {
  const event = getEventEmitter();
  event.on(eventName, handler);
}

export function cancelSubject(eventName: any, handler: any) {
  const event = getEventEmitter();
  event.off(eventName, handler);
}

export function triggerOpenCountSettingModal(data: any) {
  const event = getEventEmitter();
  event.emit(OPEN_COUNT_SETTING_MODAL, data);
}

export function triggerOpenLinkSettingModal(data: any) {
  const event = getEventEmitter();
  event.emit(OPEN_LINK_SETTING_MODAL, data);
}

export function triggerOpenFlowSettingModal(data: any) {
  const event = getEventEmitter();
  event.emit(OPEN_FLOW_SETTING_MODAL, data);
}

export function triggerOpenMindSettingModal(data: any) {
  const event = getEventEmitter();
  event.emit(OPEN_MIND_SETTING_MODAL, data);
}

export function triggerOpenExcalidrawSettingModal(data: any) {
  const event = getEventEmitter();
  event.emit(OPEN_EXCALIDRAW_SETTING_MODAL, data);
}
