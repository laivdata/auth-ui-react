import type { AuthClientConfig } from './client';
import { type OAuth2ProviderName } from './hooks';
import type { LoginFormCustomComponents } from './types/custom-components';
export interface LoginFormCustomProps {
    config: AuthClientConfig;
    workspaceId?: string;
    redirectUri?: string;
    providers?: OAuth2ProviderName[];
    workspaceName?: string;
    registerHref?: string;
    resetPasswordHref?: string;
    onSuccess?: () => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
    components?: LoginFormCustomComponents;
}
/**
 * 로그인 폼 주입용 래퍼. useLoginForm 로직 + components로 UI만 주입.
 * components 미지정 시 기본 div/input/button으로 동작.
 */
export declare function LoginFormCustom({ config, workspaceId, redirectUri, providers: providersProp, workspaceName, registerHref, resetPasswordHref, onSuccess, components: componentsProp, }: LoginFormCustomProps): import("react/jsx-runtime").JSX.Element;
