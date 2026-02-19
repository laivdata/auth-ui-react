import type { AuthClientConfig } from './client';
import type { AuthFormLayoutProps } from './form-layout-props';
export interface ResendVerificationFormProps extends Pick<AuthFormLayoutProps, 'className' | 'style' | 'formClassName' | 'formStyle'> {
    config: AuthClientConfig;
    /** 이메일 인증 페이지 URL. 넘기면 그대로 사용, 미지정 시 인증 서버에서 FRONTEND_BASE_URL + VERIFY_EMAIL_PATH 조합 */
    verificationBaseUrl?: string;
    onSuccess?: () => void;
}
/**
 * 인증 메일 재전송 폼.
 * POST /api/auth/resend-verification 호출.
 */
export declare function ResendVerificationForm({ config, verificationBaseUrl, onSuccess, className, style, formClassName, formStyle, }: ResendVerificationFormProps): import("react/jsx-runtime").JSX.Element;
