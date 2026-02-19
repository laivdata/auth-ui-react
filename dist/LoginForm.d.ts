import type { AuthClientConfig } from './client';
import { type AuthFormLayoutProps } from './form-layout-props';
import { type OAuth2ProviderName } from './hooks';
export interface LoginFormProps extends AuthFormLayoutProps {
    config: AuthClientConfig;
    workspaceId?: string;
    redirectUri?: string;
    /** OAuth2 버튼을 BE 조회 대신 직접 지정 (미지정 시 config.authServerBaseUrl 기준 GET /api/auth/oauth2/providers 자동 조회) */
    providers?: OAuth2ProviderName[];
    /** 헤더에 표시할 워크스페이스/앱 이름 (인증 서버 FE와 동일) */
    workspaceName?: string;
    /** 회원가입 페이지 링크 (있으면 푸터에 "계정이 없으신가요?" 표시) */
    registerHref?: string;
    /** 비밀번호 재설정 요청 페이지 링크 (있으면 푸터에 "비밀번호를 잊으셨나요?" 표시) */
    resetPasswordHref?: string;
    /** 'fullpage': auth-container 포함(전체 화면), 'card': 카드만(임베드용) */
    layout?: 'fullpage' | 'card';
    onSuccess?: () => void;
}
/**
 * 로그인 폼: 인증 서버 FE와 동일한 디자인(카드·헤더·폼·푸터·소셜).
 * config.authServerBaseUrl 기준으로 GET /api/auth/oauth2/providers를 호출해 사용 가능한 제공자만 자동 표시합니다.
 * 스타일 적용을 위해 '@laivdata/auth-ui-react/styles.css'를 import 하세요.
 */
export declare function LoginForm({ config, workspaceId, redirectUri, providers: providersProp, workspaceName, registerHref, resetPasswordHref, layout, onSuccess, className, containerClassName, cardClassName, formClassName, headerClassName, footerClassName, style, containerStyle, cardStyle, formStyle, headerStyle, footerStyle, }: LoginFormProps): import("react/jsx-runtime").JSX.Element;
