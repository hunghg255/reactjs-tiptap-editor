// We'll cache the result of isMac() and isTouchDevice(), since they shouldn't
// change during a session. That way repeated calls don't require any logic and
// are rapid.
let isMacResult: boolean | undefined;
let isTouchDeviceResult: boolean | undefined;

/**
 * Return true if the user is using a Mac (as opposed to Windows, etc.) device.
 */
export function isMac(): boolean {
  if (isMacResult === undefined) {
    isMacResult = navigator.platform.includes('Mac');
  }
  return isMacResult;
}

/**
 * 根据 Mac 和非 Mac 平台，返回应该用于键盘快捷键的修饰键的可读版本。用于直观地指示应该按哪个键。
 */
export function getShortcutKey(key: string): string {
  if (`${key}`.toLowerCase() === 'mod') {
    return isMac() ? '⌘' : 'Ctrl';
  } else if (`${key}`.toLowerCase() === 'alt') {
    return isMac() ? '⌥' : 'Alt';
  } else if (`${key}`.toLowerCase() === 'shift') {
    return isMac() ? '⇧' : 'Shift';
  } else {
    return key;
  }
}
export function getShortcutKeys(keys: string[]): string {
  return keys.map(getShortcutKey).join(' ');
}

/** Return true if the user is using a touch-based device. */
export function isTouchDevice(): boolean {
  if (isTouchDeviceResult === undefined) {
    // This technique is taken from
    // https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
    // (and https://stackoverflow.com/a/4819886/4543977)
    isTouchDeviceResult
      = (window && 'ontouchstart' in window)
        || navigator.maxTouchPoints > 0
      // @ts-expect-error: msMaxTouchPoints is IE-specific, so needs to be ignored
        || navigator.msMaxTouchPoints > 0;
  }

  return isTouchDeviceResult;
}
