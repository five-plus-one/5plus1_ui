export const mathPreferencesChanged = 'fp:math-preferences-changed';
export interface MathPreferenceStorage { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void }
let storage: MathPreferenceStorage | undefined;
/** The host may inject account-scoped storage and synchronize it with its service. */
export function configureMathPreferences(next?: MathPreferenceStorage) { storage = next; if (typeof window !== 'undefined') window.dispatchEvent(new Event(mathPreferencesChanged)); }
export const mathStorage: MathPreferenceStorage = {
  getItem(key) { if (storage) return storage.getItem(key); try { return globalThis.localStorage?.getItem(key) ?? null; } catch { return null; } },
  setItem(key, value) { if (storage) storage.setItem(key, value); else globalThis.localStorage?.setItem(key, value); if (typeof window !== 'undefined') window.dispatchEvent(new Event(mathPreferencesChanged)); },
};
export async function refreshMathPreferences() { if (typeof window !== 'undefined') window.dispatchEvent(new Event(mathPreferencesChanged)); }
