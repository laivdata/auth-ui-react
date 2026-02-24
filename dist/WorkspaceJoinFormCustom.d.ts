import type { AuthClientConfig } from './client';
import type { WorkspaceJoinFormCustomComponents } from './types/custom-components';
export interface WorkspaceJoinFormCustomProps {
    config: AuthClientConfig;
    workspaceId: string;
    onSuccess?: () => void;
    /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
    components?: WorkspaceJoinFormCustomComponents;
}
/**
 * 워크스페이스 가입 폼 주입용 래퍼. WorkspaceJoinForm과 동일 로직 + components로 UI만 주입.
 */
export declare function WorkspaceJoinFormCustom({ config, workspaceId, onSuccess, components: componentsProp, }: WorkspaceJoinFormCustomProps): import("react/jsx-runtime").JSX.Element;
