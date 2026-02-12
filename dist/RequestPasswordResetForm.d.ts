import type { AuthClientConfig } from './client';
export interface RequestPasswordResetFormProps {
    config: AuthClientConfig;
    /** OAuth/OIDC 컨텍스트 (선택, BE에 그대로 전달) */
    context?: string;
    /** 비밀번호 재설정 페이지 URL. 넘기면 그대로 사용, 미지정 시 인증 서버에서 FRONTEND_BASE_URL + RESET_PASSWORD_PATH 조합 */
    resetPasswordBaseUrl?: string;
    /** 헤더에 표시할 워크스페이스/앱 이름 */
    workspaceName?: string;
    /** 로그인 페이지 링크 (푸터) */
    loginHref?: string;
    /** 'fullpage' | 'card' */
    layout?: 'fullpage' | 'card';
    onSuccess?: () => void;
}
/**
 * 비밀번호 재설정 요청 폼. 이메일 입력 후 POST /api/auth/request-password-reset.
 * 스타일: '@laivdata/auth-ui-react/styles.css'
 */
export declare function RequestPasswordResetForm({ config, context, resetPasswordBaseUrl, workspaceName, loginHref, layout, onSuccess, }: RequestPasswordResetFormProps): import("react/jsx-runtime").JSX.Element;
