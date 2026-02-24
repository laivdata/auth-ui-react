import type { AuthClientConfig } from './client';
import type { RequestPasswordResetFormCustomComponents } from './types/custom-components';
export interface RequestPasswordResetFormCustomProps {
    config: AuthClientConfig;
    context?: string;
    resetPasswordBaseUrl?: string;
    workspaceName?: string;
    loginHref?: string;
    onSuccess?: () => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
    components?: RequestPasswordResetFormCustomComponents;
}
/**
 * 비밀번호 재설정 요청 폼 주입용 래퍼. RequestPasswordResetForm과 동일 로직 + components로 UI만 주입.
 */
export declare function RequestPasswordResetFormCustom({ config, context, resetPasswordBaseUrl, workspaceName, loginHref, onSuccess, components: componentsProp, }: RequestPasswordResetFormCustomProps): import("react/jsx-runtime").JSX.Element;
