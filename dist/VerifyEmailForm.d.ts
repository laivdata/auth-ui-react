import type { AuthClientConfig } from './client';
import { type AuthFormLayoutProps } from './form-layout-props';
export interface VerifyEmailFormProps extends Pick<AuthFormLayoutProps, 'className' | 'style' | 'formClassName' | 'formStyle'> {
    config: AuthClientConfig;
    /** URL 쿼리 문자열 (예: location.search). 없으면 자동으로 window.location.search 사용 */
    search?: string;
    onSuccess?: () => void;
    onFailure?: (message: string) => void;
}
/**
 * 이메일 인증 링크 랜딩 페이지용 폼.
 * URL 쿼리에서 email, code(, context, workspaceId)를 읽어 API 검증 후 성공/실패 UI 표시.
 */
export declare function VerifyEmailForm({ config, search, onSuccess, onFailure, className, style, formClassName, formStyle, }: VerifyEmailFormProps): import("react/jsx-runtime").JSX.Element;
