import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import type { ResendVerificationFormCustomComponents } from './types/custom-components';

export interface ResendVerificationFormCustomProps {
  config: AuthClientConfig;
  verificationBaseUrl?: string;
  onSuccess?: () => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
  components?: ResendVerificationFormCustomComponents;
}

const DefaultContainer: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => (
  <div className={className} style={style} data-testid="resend-verification-form-custom">
    {children}
  </div>
);

const DefaultInput: React.FC<{
  id: string;
  type: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  'data-testid'?: string;
}> = (props) => <input {...props} />;

const DefaultButton: React.FC<{
  type: 'submit' | 'button';
  disabled?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}> = (props) => <button {...props} />;

const DefaultAlert: React.FC<{ children: React.ReactNode; role?: 'alert' | 'status' }> = ({ children, role }) => (
  <p role={role}>{children}</p>
);

/**
 * 인증 메일 재전송 폼 주입용 래퍼. ResendVerificationForm과 동일 로직 + components로 UI만 주입.
 */
export function ResendVerificationFormCustom({
  config,
  verificationBaseUrl,
  onSuccess,
  components: componentsProp,
}: ResendVerificationFormCustomProps) {
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

  const Container = componentsProp?.Container ?? DefaultContainer;
  const Input = componentsProp?.Input ?? DefaultInput;
  const Button = componentsProp?.Button ?? DefaultButton;
  const Alert = componentsProp?.Alert ?? DefaultAlert;

  if (sent) {
    return (
      <Container className="" style={{}}>
        <div data-testid="resend-verification-sent">
          <Alert role="status">인증 메일을 다시 보냈습니다. 이메일을 확인해주세요.</Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="" style={{}}>
      <form onSubmit={handleSubmit}>
        <Input
          id="resend-verification-email-custom"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          required
          data-testid="resend-verification-email"
        />
        {error && (
          <Alert role="alert">
            {error}
          </Alert>
        )}
        <Button type="submit" disabled={loading} data-testid="resend-verification-submit">
          {loading ? '전송 중...' : '인증 메일 다시 보내기'}
        </Button>
      </form>
    </Container>
  );
}
