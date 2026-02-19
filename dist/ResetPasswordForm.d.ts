import type { AuthClientConfig } from './client';
import { type AuthFormLayoutProps } from './form-layout-props';
export interface ResetPasswordFormProps extends AuthFormLayoutProps {
    config: AuthClientConfig;
    search?: string;
    workspaceName?: string;
    loginHref?: string;
    /** 성공 시 이동할 경로 (미지정 시 현재 페이지에 성공 메시지만 표시) */
    successRedirectPath?: string;
    /** 실패 시 이동할 경로 (미지정 시 현재 페이지에 에러 메시지만 표시) */
    failureRedirectPath?: string;
    layout?: 'fullpage' | 'card';
    onSuccess?: () => void;
    onFailure?: (message: string) => void;
}
/**
 * 비밀번호 재설정 폼.
 * URL 쿼리에서 email, code를 읽을 수 있음. 새 비밀번호 입력 후 POST /api/auth/reset-password 호출.
 */
export declare function ResetPasswordForm({ config, search, workspaceName, loginHref, successRedirectPath, failureRedirectPath, layout, onSuccess, onFailure, className, containerClassName, cardClassName, formClassName, headerClassName, footerClassName, style, containerStyle, cardStyle, formStyle, headerStyle, footerStyle, }: ResetPasswordFormProps): import("react/jsx-runtime").JSX.Element;
