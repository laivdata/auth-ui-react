import type { AuthClientConfig } from './client';
import type { RegisterFormCustomComponents } from './types/custom-components';
export interface RegisterFormCustomProps {
    config: AuthClientConfig;
    workspaceName?: string;
    loginHref?: string;
    resendVerificationHref?: string;
    verificationBaseUrl?: string;
    onSuccess?: () => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
    components?: RegisterFormCustomComponents;
}
/**
 * 회원가입 폼 주입용 래퍼. RegisterForm과 동일 로직 + components로 UI만 주입.
 * components 미지정 시 기본 div/input/button으로 동작.
 */
export declare function RegisterFormCustom({ config, workspaceName, loginHref, resendVerificationHref, verificationBaseUrl, onSuccess, components: componentsProp, }: RegisterFormCustomProps): import("react/jsx-runtime").JSX.Element;
