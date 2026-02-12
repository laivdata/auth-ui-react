import type { TokenStorage } from './types';
/**
 * 메모리 토큰 저장소 (테스트 또는 SSR에서 사용).
 */
export declare function createMemoryStorage(): TokenStorage;
/**
 * localStorage 기반 토큰 저장소 (Different subdomain 시 클라이언트에서 사용).
 * Same subdomain이면 인증 서버가 HttpOnly 쿠키로 설정하므로 별도 저장 불필요.
 */
export declare function createLocalStorageStorage(key?: string): TokenStorage;
