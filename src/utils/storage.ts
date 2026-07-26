const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function safeExecute<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function getStoredItem(key: string): string | null {
  if (!isBrowser) return null;
  return safeExecute(() => window.localStorage.getItem(key), null);
}

export function setStoredItem(key: string, value: string): void {
  if (!isBrowser) return;
  safeExecute(() => {
    window.localStorage.setItem(key, value);
    return undefined;
  }, undefined);
}

export function removeStoredItem(key: string): void {
  if (!isBrowser) return;
  safeExecute(() => {
    window.localStorage.removeItem(key);
    return undefined;
  }, undefined);
}

export function getStoredJson<T>(key: string): T | null {
  const raw = getStoredItem(key);
  if (raw === null) return null;
  return safeExecute(() => JSON.parse(raw) as T, null);
}

export function setStoredJson<T>(key: string, value: T): void {
  setStoredItem(key, JSON.stringify(value));
}
