import { type AuthClientConfig } from './client';
import type { CallbackPageCustomComponents } from './types/custom-components';
export interface CallbackPageCustomProps {
    config: AuthClientConfig;
    search?: string;
    defaultPath?: string;
    workspaceJoinPath?: string;
    onSuccess?: (redirectUri?: string) => void;
    onFailure?: (message: string) => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div 사용 */
    components?: CallbackPageCustomComponents;
}
/**
 * OAuth2 콜백 페이지 주입용 래퍼. CallbackPage와 동일 로직 + components로 UI만 주입.
 */
export declare function CallbackPageCustom({ config, search, defaultPath, workspaceJoinPath, onSuccess, onFailure, components: componentsProp, }: CallbackPageCustomProps): import("react/jsx-runtime").JSX.Element;
