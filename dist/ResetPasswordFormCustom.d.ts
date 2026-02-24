import type { AuthClientConfig } from './client';
import type { ResetPasswordFormCustomComponents } from './types/custom-components';
export interface ResetPasswordFormCustomProps {
    config: AuthClientConfig;
    search?: string;
    workspaceName?: string;
    loginHref?: string;
    successRedirectPath?: string;
    failureRedirectPath?: string;
    onSuccess?: () => void;
    onFailure?: (message: string) => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
    components?: ResetPasswordFormCustomComponents;
}
/**
 * 비밀번호 재설정 폼 주입용 래퍼. ResetPasswordForm과 동일 로직 + components로 UI만 주입.
 */
export declare function ResetPasswordFormCustom({ config, search, workspaceName, loginHref, successRedirectPath, failureRedirectPath, onSuccess, onFailure, components: componentsProp, }: ResetPasswordFormCustomProps): import("react/jsx-runtime").JSX.Element;
