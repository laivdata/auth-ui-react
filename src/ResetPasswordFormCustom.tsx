import React, { useState, useEffect } from 'react';
import type { AuthClientConfig } from './client';
import type { ResetPasswordFormCustomComponents } from './types/custom-components';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;

export interface ResetPasswordFormCustomProps {
  config: AuthClientConfig;
  search?: string;
  workspaceName?: string;
  loginHref?: string;
  successRedirectPath?: string;
  failureRedirectPath?: string;
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
  components?: ResetPasswordFormCustomComponents;
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
  <div className={className} style={style} data-testid="reset-password-form-custom">
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
  minLength?: number;
  maxLength?: number;
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
 * 비밀번호 재설정 폼 주입용 래퍼. ResetPasswordForm과 동일 로직 + components로 UI만 주입.
 */
export function ResetPasswordFormCustom({
  config,
  search,
  workspaceName,
  loginHref,
  successRedirectPath,
  failureRedirectPath,
  onSuccess,
  onFailure,
  components: componentsProp,
}: ResetPasswordFormCustomProps) {
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

  const Container = componentsProp?.Container ?? DefaultContainer;
  const Card = componentsProp?.Card ?? DefaultCard;
  const Input = componentsProp?.Input ?? DefaultInput;
  const Label = componentsProp?.Label ?? DefaultLabel;
  const Button = componentsProp?.Button ?? DefaultButton;
  const Alert = componentsProp?.Alert ?? DefaultAlert;
  const Link = componentsProp?.Link ?? DefaultLink;

  if (success) {
    return (
      <Container className="auth-container" style={{}}>
        <Card className="auth-card" style={{}}>
          <div className="auth-header">
            {workspaceName && <h2>{workspaceName}</h2>}
            <p>비밀번호 변경 완료</p>
          </div>
          <Alert role="status">비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.</Alert>
          {loginHref && (
            <div className="auth-footer">
              <Link href={loginHref} data-testid="reset-password-login-link">
                로그인하기
              </Link>
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
          <p>새 비밀번호 설정</p>
        </div>

        {error && (
          <Alert role="alert">
            {error}
          </Alert>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Label htmlFor="reset-password-email-custom">이메일 주소</Label>
            <Input
              id="reset-password-email-custom"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              data-testid="reset-password-email"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="reset-password-code-custom">인증 코드</Label>
            <Input
              id="reset-password-code-custom"
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="이메일로 받은 인증 코드 (6자리)"
              required
              data-testid="reset-password-code"
              autoComplete="one-time-code"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="reset-password-new-password-custom">새 비밀번호</Label>
            <Input
              id="reset-password-new-password-custom"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={`${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`}
              required
              minLength={PASSWORD_MIN}
              maxLength={PASSWORD_MAX}
              data-testid="reset-password-new-password"
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="reset-password-confirm-custom">비밀번호 확인</Label>
            <Input
              id="reset-password-confirm-custom"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              required
              data-testid="reset-password-confirm"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={loading} data-testid="reset-password-submit">
            {loading ? '처리 중...' : '비밀번호 재설정'}
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
