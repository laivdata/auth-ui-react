import type { AuthClientConfig } from './client';
import type { VerifyEmailFormCustomComponents } from './types/custom-components';
export interface VerifyEmailFormCustomProps {
    config: AuthClientConfig;
    search?: string;
    onSuccess?: () => void;
    onFailure?: (message: string) => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
    components?: VerifyEmailFormCustomComponents;
}
/**
 * 이메일 인증 폼 주입용 래퍼. VerifyEmailForm과 동일 로직 + components로 UI만 주입.
 */
export declare function VerifyEmailFormCustom({ config, search, onSuccess, onFailure, components: componentsProp, }: VerifyEmailFormCustomProps): import("react/jsx-runtime").JSX.Element;
