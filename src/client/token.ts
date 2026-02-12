import type { TokenStorage } from './types';

const DEFAULT_ACCESS_KEY = 'agent_auth_access_token';

/**
 * 메모리 토큰 저장소 (테스트 또는 SSR에서 사용).
 */
export function createMemoryStorage(): TokenStorage {
  let token: string | null = null;
  return {
    getAccessToken: () => token,
    setAccessToken: (t: string) => { token = t; },
    clear: () => { token = null; },
  };
}

/**
 * localStorage 기반 토큰 저장소 (Different subdomain 시 클라이언트에서 사용).
 * Same subdomain이면 인증 서버가 HttpOnly 쿠키로 설정하므로 별도 저장 불필요.
 */
export function createLocalStorageStorage(key: string = DEFAULT_ACCESS_KEY): TokenStorage {
  return {
    getAccessToken: () => {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    },
    setAccessToken: (t: string) => {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, t);
    },
    clear: () => {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    },
  };
}
