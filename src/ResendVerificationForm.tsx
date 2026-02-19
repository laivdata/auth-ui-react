import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import type { AuthFormLayoutProps } from './form-layout-props';

export interface ResendVerificationFormProps extends Pick<AuthFormLayoutProps, 'className' | 'style' | 'formClassName' | 'formStyle'> {
  config: AuthClientConfig;
  /** 이메일 인증 페이지 URL. 넘기면 그대로 사용, 미지정 시 인증 서버에서 FRONTEND_BASE_URL + VERIFY_EMAIL_PATH 조합 */
  verificationBaseUrl?: string;
  onSuccess?: () => void;
}

/**
 * 인증 메일 재전송 폼.
 * POST /api/auth/resend-verification 호출.
 */
export function ResendVerificationForm({
  config,
  verificationBaseUrl,
  onSuccess,
  className,
  style,
  formClassName,
  formStyle,
}: ResendVerificationFormProps) {
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
      const res = await fetch(`${baseUrl}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          ...(verificationBaseUrl && { verificationBaseUrl: verificationBaseUrl.replace(/\/$/, '') }),
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '재전송 실패');
      setSent(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '재전송 실패');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={className} style={style} data-testid="resend-verification-sent">
        <p role="status">인증 메일을 다시 보냈습니다. 이메일을 확인해주세요.</p>
      </div>
    );
  }

  return (
    <div className={className} style={style} data-testid="resend-verification-form">
      <form className={formClassName} style={formStyle} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="resend-verification-email"
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading} data-testid="resend-verification-submit">
          {loading ? '전송 중...' : '인증 메일 다시 보내기'}
        </button>
      </form>
    </div>
  );
}
