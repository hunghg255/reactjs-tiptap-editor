export function safeJSONParse<T = unknown>(str: unknown, defaultValue: T = {} as T): T {
  if (typeof str === 'object') return str as T;

  try {
    return typeof str === 'string' ? JSON.parse(str) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeJSONStringify(obj: unknown, defaultValue = '{}') {
  try {
    return JSON.stringify(obj);
  } catch {
    return defaultValue;
  }
}
