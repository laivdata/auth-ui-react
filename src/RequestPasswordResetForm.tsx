import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import { mergeClassName, type AuthFormLayoutProps } from './form-layout-props';

export interface RequestPasswordResetFormProps extends AuthFormLayoutProps {
  config: AuthClientConfig;
  /** OAuth/OIDC 컨텍스트 (선택, BE에 그대로 전달) */
  context?: string;
  /** 비밀번호 재설정 페이지 URL. 넘기면 그대로 사용, 미지정 시 인증 서버에서 FRONTEND_BASE_URL + RESET_PASSWORD_PATH 조합 */
  resetPasswordBaseUrl?: string;
  /** 헤더에 표시할 워크스페이스/앱 이름 */
  workspaceName?: string;
  /** 로그인 페이지 링크 (푸터) */
  loginHref?: string;
  /** 'fullpage' | 'card' */
  layout?: 'fullpage' | 'card';
  onSuccess?: () => void;
}

/**
 * 비밀번호 재설정 요청 폼. 이메일 입력 후 POST /api/auth/request-password-reset.
 * 스타일: '@laivdata/auth-ui-react/styles.css'
 */
export function RequestPasswordResetForm({
  config,
  context,
  resetPasswordBaseUrl,
  workspaceName,
  loginHref,
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
}: RequestPasswordResetFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          ...(context && { context }),
          ...(resetPasswordBaseUrl && { resetPasswordBaseUrl }),
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '요청 실패');
      setSent(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '요청 실패');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    const sentCard = (
      <div
        className={mergeClassName('auth-card', cardClassName ?? className)}
        style={cardStyle ?? style}
        data-testid="request-password-reset-sent"
      >
        <div className={mergeClassName('auth-header', headerClassName)} style={headerStyle}>
          {workspaceName && <h2>{workspaceName}</h2>}
          <p>이메일 발송 완료</p>
        </div>
        <div className="alert alert-success" role="status">
          비밀번호 재설정 메일을 보냈습니다. 이메일을 확인해주세요.
        </div>
        {loginHref && (
          <div className={mergeClassName('auth-footer', footerClassName)} style={footerStyle}>
            <a href={loginHref}>로그인 페이지로 돌아가기</a>
          </div>
        )}
      </div>
    );
    return layout === 'card' ? sentCard : (
      <div className={mergeClassName('auth-container', containerClassName)} style={containerStyle}>
        {sentCard}
      </div>
    );
  }

  const card = (
    <div
      className={mergeClassName('auth-card', cardClassName ?? className)}
      style={cardStyle ?? style}
      data-testid="request-password-reset-form"
    >
      <div className={mergeClassName('auth-header', headerClassName)} style={headerStyle}>
        {workspaceName && <h2>{workspaceName}</h2>}
        <p>비밀번호 재설정</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form className={mergeClassName('auth-form', formClassName)} style={formStyle} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="request-password-reset-email">이메일 주소</label>
          <input
            id="request-password-reset-email"
            type="email"
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="request-password-reset-email"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          data-testid="request-password-reset-submit"
        >
          {loading ? '전송 중...' : '재설정 링크 전송'}
        </button>
      </form>

      {loginHref && (
        <div className={mergeClassName('auth-footer', footerClassName)} style={footerStyle}>
          <a href={loginHref}>로그인 페이지로 돌아가기</a>
        </div>
      )}
    </div>
  );

  if (layout === 'card') return card;
  return (
    <div className={mergeClassName('auth-container', containerClassName)} style={containerStyle}>
      {card}
    </div>
  );
}
