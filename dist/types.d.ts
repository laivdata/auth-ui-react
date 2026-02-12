import type { ReactNode } from 'react';
import type { AuthClientConfig } from './client';
export interface AuthProviderProps {
    config: AuthClientConfig;
    children: ReactNode;
}
export interface LoginFormProps {
    /** 인증 서버 설정 */
    config: AuthClientConfig;
    /** OAuth2 사용 시 workspaceId (커스텀 도메인) */
    workspaceId?: string;
    /** OAuth2 사용 시 최종 리다이렉트 URI */
    redirectUri?: string;
    /** 로그인 성공 시 리다이렉트 (같은 페이지면 생략) */
    onSuccess?: () => void;
}
export interface RegisterFormProps {
    config: AuthClientConfig;
    onSuccess?: () => void;
}
export interface WorkspaceJoinFormProps {
    config: AuthClientConfig;
    workspaceId: string;
    onSuccess?: () => void;
}
