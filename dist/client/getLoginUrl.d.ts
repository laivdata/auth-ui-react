import type { AuthClientConfig, GetOAuth2LoginUrlOptions, OAuth2ProviderInfo } from './types';
/**
 * OAuth2 로그인 URL을 반환합니다.
 * 인증 서버 API POST /api/auth/oauth2/login-url/:provider 를 호출하여 loginUrl을 가져옵니다.
 * (실제 환경에서는 백엔드에서 이 API를 호출하거나, CORS 허용 시 클라이언트에서 호출)
 */
export declare function getOAuth2LoginUrl(config: AuthClientConfig, options: GetOAuth2LoginUrlOptions): Promise<string>;
/**
 * 로컬 로그인 페이지 URL (인증 서버 내장 페이지).
 * 서비스 도메인에서 로그인 페이지를 쓰지 않고 인증 서버로 보낼 때 사용.
 */
export declare function getLoginPageUrl(config: AuthClientConfig): string;
/** /fe/login 호출 시 넘길 쿼리 파라미터 (인증 서버 ctx 규칙과 동일) */
export interface GetAuthServerLoginUrlOptions {
    /** 워크스페이스 ID (client_id로 전달) */
    workspaceId?: string;
    /** 로그인 성공 후 돌아올 콜백 URL */
    redirectUri?: string;
    /** response_type (예: 'code') */
    responseType?: string;
    /** OAuth2 state (상관 ID 등) */
    state?: string;
}
/**
 * 인증 서버 /fe/login 페이지 URL (쿼리 파라미터 포함).
 * 로그인 후 앱으로 돌아오려면 workspaceId, redirectUri, responseType=code 를 넘기면 됨.
 */
export declare function getAuthServerLoginUrl(config: AuthClientConfig, options?: GetAuthServerLoginUrlOptions): string;
/**
 * 인증 서버에서 사용 가능한 OAuth2 제공자 목록을 조회합니다.
 * GET /api/auth/oauth2/providers (DISABLED_OAUTH_BUTTONS 반영).
 * config.authServerBaseUrl만 있으면 되며, 로그인 버튼을 자동으로 구성할 때 사용합니다.
 */
export declare function getAvailableOAuth2Providers(config: AuthClientConfig): Promise<OAuth2ProviderInfo[]>;
/**
 * OAuth2 제공자로 리다이렉트하는 URL (GET 리다이렉트 엔드포인트).
 * 인증 서버가 GET /api/auth/oauth2/provider/:provider?redirect_uri=...&workspace_id=...&email=... 로 리다이렉트해 주는 URL.
 */
export declare function getOAuth2ProviderRedirectUrl(config: AuthClientConfig, options: GetOAuth2LoginUrlOptions): string;
