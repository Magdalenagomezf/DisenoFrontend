import { AuthUser } from './login.service';

export function userScopedKey(user: AuthUser | null, base: string) {
  const id = user?.username ?? 'anon';
  return `${base}::${id}`;
}

export function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
