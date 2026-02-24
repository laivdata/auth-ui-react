import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import type { RegisterFormCustomComponents } from './types/custom-components';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;
const DISPLAY_NAME_MIN = 2;
const DISPLAY_NAME_MAX = 50;

export interface RegisterFormCustomProps {
  config: AuthClientConfig;
  workspaceName?: string;
  loginHref?: string;
  resendVerificationHref?: string;
  verificationBaseUrl?: string;
  onSuccess?: () => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
  components?: RegisterFormCustomComponents;
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
  <div className={className} style={style} data-testid="register-form-custom">
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
  'data-testid'?: string;
}> = (props) => <button {...props} />;

const DefaultAlert: React.FC<{ children: React.ReactNode; role?: 'alert' }> = ({ children, role = 'alert' }) => (
  <div role={role}>{children}</div>
);

const DefaultLink: React.FC<{ href: string; children: React.ReactNode; 'data-testid'?: string }> = (props) => (
  <a {...props} />
);

/**
 * 회원가입 폼 주입용 래퍼. RegisterForm과 동일 로직 + components로 UI만 주입.
 * components 미지정 시 기본 div/input/button으로 동작.
 */
export function RegisterFormCustom({
  config,
  workspaceName,
  loginHref,
  resendVerificationHref,
  verificationBaseUrl,
  onSuccess,
  components: componentsProp,
}: RegisterFormCustomProps) {
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

  const Container = componentsProp?.Container ?? DefaultContainer;
  const Card = componentsProp?.Card ?? DefaultCard;
  const Input = componentsProp?.Input ?? DefaultInput;
  const Label = componentsProp?.Label ?? DefaultLabel;
  const Button = componentsProp?.Button ?? DefaultButton;
  const Alert = componentsProp?.Alert ?? DefaultAlert;
  const Link = componentsProp?.Link ?? DefaultLink;

  const hasFooterLinks = !!(loginHref || resendVerificationHref);

  return (
    <Container className="auth-container" style={{}}>
      <Card className="auth-card" style={{}}>
        <div className="auth-header">
          {workspaceName && <h2>{workspaceName}</h2>}
          <p>회원가입</p>
        </div>

        {error && (
          <Alert role="alert">
            {error}
          </Alert>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <Label htmlFor="register-displayName-custom">이름</Label>
            <Input
              id="register-displayName-custom"
              type="text"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="이름"
              required
              minLength={DISPLAY_NAME_MIN}
              maxLength={DISPLAY_NAME_MAX}
              data-testid="register-displayName"
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="register-email-custom">이메일</Label>
            <Input
              id="register-email-custom"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              data-testid="register-email"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="register-password-custom">비밀번호</Label>
            <Input
              id="register-password-custom"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`}
              required
              minLength={PASSWORD_MIN}
              maxLength={PASSWORD_MAX}
              data-testid="register-password"
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="register-confirmPassword-custom">비밀번호 확인</Label>
            <Input
              id="register-confirmPassword-custom"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              required
              data-testid="register-confirmPassword"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={loading} data-testid="register-submit">
            {loading ? '가입 중...' : '회원가입'}
          </Button>
        </form>

        {hasFooterLinks && (
          <div className="auth-footer">
            {loginHref && (
              <Link href={loginHref} data-testid="register-login-link">
                이미 계정이 있으신가요?
              </Link>
            )}
            {resendVerificationHref && (
              <Link href={resendVerificationHref} data-testid="register-resend-link">
                이메일 인증을 재전송하시겠습니까?
              </Link>
            )}
          </div>
        )}
      </Card>
    </Container>
  );
}
