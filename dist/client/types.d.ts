/**
 * Auth client configuration (Same/Different subdomain).
 */
export interface AuthClientConfig {
    authServerBaseUrl: string;
    callbackPath?: string;
    appBaseUrl?: string;
}
export interface GetOAuth2LoginUrlOptions {
    provider: 'GOOGLE' | 'NAVER' | 'KAKAO';
    redirectUri?: string;
    workspaceId?: string;
    email?: string;
}
export interface CallbackParams {
    code?: string;
    state?: string;
    error?: string;
    error_description?: string;
}
export interface TokenStorage {
    getAccessToken(): string | null;
    setAccessToken(token: string): void;
    clear(): void;
}
/** GET /api/auth/oauth2/providers 응답의 제공자 한 건 */
export interface OAuth2ProviderInfo {
    provider: string;
    displayName: string;
    enabled: boolean;
    loginUrl: string;
}
