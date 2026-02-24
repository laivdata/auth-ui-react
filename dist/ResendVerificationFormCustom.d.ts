import type { AuthClientConfig } from './client';
import type { ResendVerificationFormCustomComponents } from './types/custom-components';
export interface ResendVerificationFormCustomProps {
    config: AuthClientConfig;
    verificationBaseUrl?: string;
    onSuccess?: () => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
    components?: ResendVerificationFormCustomComponents;
}
/**
 * 인증 메일 재전송 폼 주입용 래퍼. ResendVerificationForm과 동일 로직 + components로 UI만 주입.
 */
export declare function ResendVerificationFormCustom({ config, verificationBaseUrl, onSuccess, components: componentsProp, }: ResendVerificationFormCustomProps): import("react/jsx-runtime").JSX.Element;
