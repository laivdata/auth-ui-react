import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import type { RequestPasswordResetFormCustomComponents } from './types/custom-components';

export interface RequestPasswordResetFormCustomProps {
  config: AuthClientConfig;
  context?: string;
  resetPasswordBaseUrl?: string;
  workspaceName?: string;
  loginHref?: string;
  onSuccess?: () => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
  components?: RequestPasswordResetFormCustomComponents;
}

const DefaultContainer: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => (
  <div className={className} style={style}>
    {children}
  </div>
);

const DefaultCard: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => (
  <div className={className} style={style} data-testid="request-password-reset-form-custom">
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

const DefaultLabel: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor}>{children}</label>
);

const DefaultButton: React.FC<{
  type: 'submit' | 'button';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
}> = (props) => <button {...props} />;

const DefaultAlert: React.FC<{ children: React.ReactNode; role?: 'alert' | 'status' }> = ({ children, role }) => (
  <div role={role}>{children}</div>
);

const DefaultLink: React.FC<{ href: string; children: React.ReactNode; 'data-testid'?: string }> = (props) => (
  <a {...props} />
);

/**
 * 비밀번호 재설정 요청 폼 주입용 래퍼. RequestPasswordResetForm과 동일 로직 + components로 UI만 주입.
 */
export function RequestPasswordResetFormCustom({
  config,
  context,
  resetPasswordBaseUrl,
  workspaceName,
  loginHref,
  onSuccess,
  components: componentsProp,
}: RequestPasswordResetFormCustomProps) {
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

  const Container = componentsProp?.Container ?? DefaultContainer;
  const Card = componentsProp?.Card ?? DefaultCard;
  const Input = componentsProp?.Input ?? DefaultInput;
  const Label = componentsProp?.Label ?? DefaultLabel;
  const Button = componentsProp?.Button ?? DefaultButton;
  const Alert = componentsProp?.Alert ?? DefaultAlert;
  const Link = componentsProp?.Link ?? DefaultLink;

  if (sent) {
    return (
      <Container className="auth-container" style={{}}>
        <Card className="auth-card" style={{}}>
          <div className="auth-header">
            {workspaceName && <h2>{workspaceName}</h2>}
            <p>이메일 발송 완료</p>
          </div>
          <Alert role="status">비밀번호 재설정 메일을 보냈습니다. 이메일을 확인해주세요.</Alert>
          {loginHref && (
            <div className="auth-footer">
              <Link href={loginHref}>로그인 페이지로 돌아가기</Link>
            </div>
          )}
        </Card>
      </Container>
    );
  }

  return (
    <Container className="auth-container" style={{}}>
      <Card className="auth-card" style={{}}>
        <div className="auth-header">
          {workspaceName && <h2>{workspaceName}</h2>}
          <p>비밀번호 재설정</p>
        </div>

        {error && (
          <Alert role="alert">
            {error}
          </Alert>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Label htmlFor="request-password-reset-email-custom">이메일 주소</Label>
            <Input
              id="request-password-reset-email-custom"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              data-testid="request-password-reset-email"
              autoComplete="email"
            />
          </div>
          <Button type="submit" disabled={loading} data-testid="request-password-reset-submit">
            {loading ? '전송 중...' : '재설정 링크 전송'}
          </Button>
        </form>

        {loginHref && (
          <div className="auth-footer">
            <Link href={loginHref}>로그인 페이지로 돌아가기</Link>
          </div>
        )}
      </Card>
    </Container>
  );
}
