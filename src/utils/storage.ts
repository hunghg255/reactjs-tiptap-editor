export function getStorage(key: string, defaultValue: unknown = null): unknown {
  // oxlint-disable-next-line unicorn/error-message
  if (typeof window === 'undefined') throw new Error();

  const value = localStorage.getItem(key);
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function setStorage(key: string, value: unknown) {
  window.localStorage.setItem(key, `${value}`);
}
