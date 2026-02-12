import type { AuthClientConfig } from './client';
export interface RegisterFormProps {
    config: AuthClientConfig;
    /** 헤더에 표시할 워크스페이스/앱 이름 */
    workspaceName?: string;
    /** 로그인 페이지 링크 (있으면 푸터에 "이미 계정이 있으신가요?" 표시) */
    loginHref?: string;
    /** 인증 메일 재전송 페이지 링크 (있으면 푸터에 표시) */
    resendVerificationHref?: string;
    /** 이메일 인증 페이지 URL. 넘기면 그대로 사용, 미지정 시 인증 서버에서 env + VERIFY_EMAIL_PATH 조합. ResendVerificationForm의 verificationBaseUrl과 동일 */
    verificationBaseUrl?: string;
    /** 'fullpage': auth-container 포함, 'card': 카드만 */
    layout?: 'fullpage' | 'card';
    onSuccess?: () => void;
}
/**
 * 회원가입 폼. 인증 서버 FE와 동일한 비밀번호·표시명 제약 및 비밀번호 확인 검증.
 * 스타일 적용을 위해 '@laivdata/auth-ui-react/styles.css'를 import 하세요.
 */
export declare function RegisterForm({ config, workspaceName, loginHref, resendVerificationHref, verificationBaseUrl, layout, onSuccess, }: RegisterFormProps): import("react/jsx-runtime").JSX.Element;
