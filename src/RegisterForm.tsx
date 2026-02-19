import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import { mergeClassName, type AuthFormLayoutProps } from './form-layout-props';

/** 서버 LocalRegisterDto와 동일한 제약 */
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;
const DISPLAY_NAME_MIN = 2;
const DISPLAY_NAME_MAX = 50;

export interface RegisterFormProps extends AuthFormLayoutProps {
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
export function RegisterForm({
  config,
  workspaceName,
  loginHref,
  resendVerificationHref,
  verificationBaseUrl,
  layout = 'fullpage',
  onSuccess,
  className,
  containerClassName,
  cardClassName,
  formClassName,
  headerClassName,
  footerClassName,
  style,
  containerStyle,
  cardStyle,
  formStyle,
  headerStyle,
  footerStyle,
}: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');

  const validate = (): string | null => {
    const trimEmail = email.trim();
    const trimDisplayName = displayName.trim();
    if (!trimEmail) return '이메일을 입력하세요.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) return '올바른 이메일 형식이 아닙니다.';
    if (trimDisplayName.length < DISPLAY_NAME_MIN) return `표시명은 최소 ${DISPLAY_NAME_MIN}자 이상이어야 합니다.`;
    if (trimDisplayName.length > DISPLAY_NAME_MAX) return `표시명은 최대 ${DISPLAY_NAME_MAX}자까지 가능합니다.`;
    if (password.length < PASSWORD_MIN) return `비밀번호는 최소 ${PASSWORD_MIN}자 이상이어야 합니다.`;
    if (password.length > PASSWORD_MAX) return `비밀번호는 최대 ${PASSWORD_MAX}자까지 가능합니다.`;
    if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          ...(verificationBaseUrl && {
            verificationBaseUrl: verificationBaseUrl.replace(/\/$/, ''),
          }),
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '회원가입 실패');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 실패');
    } finally {
      setLoading(false);
    }
  };

  const hasFooterLinks = !!(loginHref || resendVerificationHref);

  const card = (
    <div
      className={mergeClassName('auth-card', cardClassName ?? className)}
      style={cardStyle ?? style}
      data-testid="register-form"
    >
      <div className={mergeClassName('auth-header', headerClassName)} style={headerStyle}>
        {workspaceName && <h2>{workspaceName}</h2>}
        <p>회원가입</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form className={mergeClassName('auth-form', formClassName)} style={formStyle} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="register-displayName">이름</label>
          <input
            id="register-displayName"
            type="text"
            name="displayName"
            placeholder="이름"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={DISPLAY_NAME_MIN}
            maxLength={DISPLAY_NAME_MAX}
            data-testid="register-displayName"
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">이메일</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="register-email"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">비밀번호</label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder={`${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
            data-testid="register-password"
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-confirmPassword">비밀번호 확인</label>
          <input
            id="register-confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            data-testid="register-confirmPassword"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          data-testid="register-submit"
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      {hasFooterLinks && (
        <div className={mergeClassName('auth-footer', footerClassName)} style={footerStyle}>
          {loginHref && (
            <a href={loginHref} data-testid="register-login-link">
              이미 계정이 있으신가요?
            </a>
          )}
          {resendVerificationHref && (
            <a href={resendVerificationHref} data-testid="register-resend-link">
              이메일 인증을 재전송하시겠습니까?
            </a>
          )}
        </div>
      )}
    </div>
  );

  if (layout === 'card') {
    return card;
  }

  return (
    <div
      className={mergeClassName('auth-container', containerClassName)}
      style={containerStyle}
    >
      {card}
    </div>
  );
}
