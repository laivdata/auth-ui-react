import type { AuthClientConfig } from './client';
import type { AuthFormLayoutProps } from './form-layout-props';
export interface WorkspaceJoinFormProps extends Pick<AuthFormLayoutProps, 'className' | 'style' | 'formClassName' | 'formStyle'> {
    config: AuthClientConfig;
    workspaceId: string;
    onSuccess?: () => void;
}
/**
 * 워크스페이스 가입 폼 (비밀번호가 필요한 경우 secret 입력).
 */
export declare function WorkspaceJoinForm({ config, workspaceId, onSuccess, className, style, formClassName, formStyle, }: WorkspaceJoinFormProps): import("react/jsx-runtime").JSX.Element;
