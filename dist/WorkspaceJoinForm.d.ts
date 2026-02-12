import type { AuthClientConfig } from './client';
export interface WorkspaceJoinFormProps {
    config: AuthClientConfig;
    workspaceId: string;
    onSuccess?: () => void;
}
/**
 * 워크스페이스 가입 폼 (비밀번호가 필요한 경우 secret 입력).
 */
export declare function WorkspaceJoinForm({ config, workspaceId, onSuccess }: WorkspaceJoinFormProps): import("react/jsx-runtime").JSX.Element;
