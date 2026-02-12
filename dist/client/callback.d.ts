import type { CallbackParams } from './types';
/**
 * URL 쿼리 또는 URLSearchParams에서 OAuth2 콜백 파라미터(code, state, error) 추출.
 * 인증 서버가 클라이언트로 리다이렉트할 때 OAuth2 관례대로 쿼리 키는 state(클라이언트가 보낸 값 그대로 반환).
 */
export declare function getCallbackParams(search: string | URLSearchParams): CallbackParams;
/**
 * 콜백 후 로그인 API에 보낼 redirectUri.
 * Same subdomain: 인증 서버 콜백 URL (우리 서버가 받는 URL).
 * Different subdomain: 현재 앱의 콜백 페이지 전체 URL (인증 서버가 코드 교환 시 사용).
 */
export declare function getCallbackRedirectUri(config: {
    authServerBaseUrl: string;
    appBaseUrl?: string;
    callbackPath?: string;
}): string;
