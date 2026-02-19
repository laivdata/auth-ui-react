import { type AuthClientConfig, type OAuth2ProviderInfo } from '../client';
export type OAuth2ProviderName = 'GOOGLE' | 'NAVER' | 'KAKAO';
export interface UseLoginFormConfig {
    config: AuthClientConfig;
    workspaceId?: string;
    redirectUri?: string;
    /** OAuth2 버튼을 BE 조회 대신 직접 지정 (미지정 시 config.authServerBaseUrl 기준 GET /api/auth/oauth2/providers 자동 조회) */
    providers?: OAuth2ProviderName[];
    onSuccess?: () => void;
}
export interface UseLoginFormReturn {
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    loading: boolean;
    error: string | null;
    setError: (v: string | null) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    oauthProviders: OAuth2ProviderInfo[];
}
/**
 * 로그인 폼 상태·제출·OAuth2 제공자 목록을 담당하는 훅.
 * 주입용 UI(LoginFormCustom 등)에서 디자인 컴포넌트만 주입하고 이 훅으로 로직을 연결할 때 사용.
 */
export declare function useLoginForm({ config, workspaceId, redirectUri, providers: providersProp, onSuccess, }: UseLoginFormConfig): UseLoginFormReturn;
