import { type AuthClientConfig } from './client';
export interface CallbackPageProps {
    config: AuthClientConfig;
    /** URL 쿼리 (예: location.search). 없으면 window.location.search 사용 */
    search?: string;
    /** 토큰 교환 성공 후 워크스페이스가 있을 때 이동할 경로 */
    defaultPath?: string;
    /** 워크스페이스 미가입 시 이동할 경로 */
    workspaceJoinPath?: string;
    onSuccess?: (redirectUri?: string) => void;
    onFailure?: (message: string) => void;
}
/**
 * OAuth2 콜백 페이지 컴포넌트.
 * 보안상 code는 필수입니다. 인증 서버가 서비스로 리다이렉트할 때 code(및 state)를 쿼리에 포함합니다.
 * - code 있음: POST /api/auth/token으로 토큰 교환 → user.wsid에 따라 defaultPath 또는 workspaceJoinPath로 이동.
 * - code 없음: 에러 표시 (로그인 페이지에서 다시 시도 유도).
 */
export declare function CallbackPage({ config, search, defaultPath, workspaceJoinPath, onSuccess, onFailure, }: CallbackPageProps): import("react/jsx-runtime").JSX.Element;
