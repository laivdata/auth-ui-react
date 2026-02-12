"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallbackParams = getCallbackParams;
exports.getCallbackRedirectUri = getCallbackRedirectUri;
/**
 * URL 쿼리 또는 URLSearchParams에서 OAuth2 콜백 파라미터(code, state, error) 추출.
 * 인증 서버가 클라이언트로 리다이렉트할 때 OAuth2 관례대로 쿼리 키는 state(클라이언트가 보낸 값 그대로 반환).
 */
function getCallbackParams(search) {
    const params = typeof search === 'string'
        ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
        : search;
    return {
        code: params.get('code') ?? undefined,
        state: params.get('state') ?? undefined,
        error: params.get('error') ?? undefined,
        error_description: params.get('error_description') ?? undefined,
    };
}
/**
 * 콜백 후 로그인 API에 보낼 redirectUri.
 * Same subdomain: 인증 서버 콜백 URL (우리 서버가 받는 URL).
 * Different subdomain: 현재 앱의 콜백 페이지 전체 URL (인증 서버가 코드 교환 시 사용).
 */
function getCallbackRedirectUri(config) {
    const base = config.appBaseUrl ?? config.authServerBaseUrl;
    const path = config.callbackPath ?? '/fe/callback';
    const origin = base.replace(/\/$/, '');
    const pathNorm = path.startsWith('/') ? path : `/${path}`;
    return `${origin}${pathNorm}`;
}
