import React, { useState, useEffect } from 'react';
import type { AuthClientConfig } from './client';
import { mergeClassName, type AuthFormLayoutProps } from './form-layout-props';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;

export interface ResetPasswordFormProps extends AuthFormLayoutProps {
  config: AuthClientConfig;
  search?: string;
  workspaceName?: string;
  loginHref?: string;
  /** 성공 시 이동할 경로 (미지정 시 현재 페이지에 성공 메시지만 표시) */
  successRedirectPath?: string;
  /** 실패 시 이동할 경로 (미지정 시 현재 페이지에 에러 메시지만 표시) */
  failureRedirectPath?: string;
  layout?: 'fullpage' | 'card';
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
}

/**
 * 비밀번호 재설정 폼.
 * URL 쿼리에서 email, code를 읽을 수 있음. 새 비밀번호 입력 후 POST /api/auth/reset-password 호출.
 */
export function ResetPasswordForm({
  config,
  search,
  workspaceName,
  loginHref,
  successRedirectPath,
  failureRedirectPath,
  layout = 'fullpage',
  onSuccess,
  onFailure,
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
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
  const searchStr = search ?? (typeof window !== 'undefined' ? window.location.search : '');

  useEffect(() => {
    const qs = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
    const params = new URLSearchParams(qs);
    const emailFromUrl = params.get('email');
    const codeFromUrl = params.get('code');
    if (emailFromUrl) setEmail(emailFromUrl);
    if (codeFromUrl) setCode(codeFromUrl);
  }, [searchStr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !code.trim() || !newPassword.trim()) {
      setError('이메일, 인증 코드, 새 비밀번호를 모두 입력하세요.');
      return;
    }
    if (newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX) {
      setError(`비밀번호는 ${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하여야 합니다.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          newPassword: newPassword.trim(),
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '비밀번호 재설정 실패');
      onSuccess?.();
      if (successRedirectPath) {
        window.location.href = successRedirectPath;
        return;
      }
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '비밀번호 재설정 실패';
      onFailure?.(msg);
      if (failureRedirectPath) {
        const url = new URL(failureRedirectPath, typeof window !== 'undefined' ? window.location.origin : '');
        url.searchParams.set('error', msg);
        window.location.href = url.pathname + url.search;
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const successCard = (
      <div
        className={mergeClassName('auth-card', cardClassName ?? className)}
        style={cardStyle ?? style}
        data-testid="reset-password-success"
      >
        <div className={mergeClassName('auth-header', headerClassName)} style={headerStyle}>
          {workspaceName && <h2>{workspaceName}</h2>}
          <p>비밀번호 변경 완료</p>
        </div>
        <div className="alert alert-success" role="status">
          비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.
        </div>
        {loginHref && (
          <div className={mergeClassName('auth-footer', footerClassName)} style={footerStyle}>
            <a href={loginHref} data-testid="reset-password-login-link">로그인하기</a>
          </div>
        )}
      </div>
    );
    return layout === 'card' ? successCard : (
      <div className={mergeClassName('auth-container', containerClassName)} style={containerStyle}>
        {successCard}
      </div>
    );
  }

  const card = (
    <div
      className={mergeClassName('auth-card', cardClassName ?? className)}
      style={cardStyle ?? style}
      data-testid="reset-password-form"
    >
      <div className={mergeClassName('auth-header', headerClassName)} style={headerStyle}>
        {workspaceName && <h2>{workspaceName}</h2>}
        <p>새 비밀번호 설정</p>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}
      <form className={mergeClassName('auth-form', formClassName)} style={formStyle} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reset-password-email">이메일 주소</label>
          <input
            id="reset-password-email"
            type="email"
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="reset-password-email"
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reset-password-code">인증 코드</label>
          <input
            id="reset-password-code"
            type="text"
            name="code"
            placeholder="이메일로 받은 인증 코드 (6자리)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            data-testid="reset-password-code"
            autoComplete="one-time-code"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reset-password-new-password">새 비밀번호</label>
          <input
            id="reset-password-new-password"
            type="password"
            name="newPassword"
            placeholder={`${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
            data-testid="reset-password-new-password"
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reset-password-confirm">비밀번호 확인</label>
          <input
            id="reset-password-confirm"
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            data-testid="reset-password-confirm"
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} data-testid="reset-password-submit">
          {loading ? '처리 중...' : '비밀번호 재설정'}
        </button>
      </form>
      {loginHref && (
        <div className={mergeClassName('auth-footer', footerClassName)} style={footerStyle}>
          <a href={loginHref}>로그인 페이지로 돌아가기</a>
        </div>
      )}
    </div>
  );

  return layout === 'card' ? card : (
    <div className={mergeClassName('auth-container', containerClassName)} style={containerStyle}>
      {card}
    </div>
  );
}
