import React from 'react';
import type { AuthClientConfig, OAuth2ProviderInfo } from './client';
import { useLoginForm, type OAuth2ProviderName } from './hooks';
import type { LoginFormCustomComponents } from './types/custom-components';

/** loginUrl에 redirect_uri, workspace_id 쿼리 추가 (API 조회 결과 URL용) */
function buildOAuth2Link(
  info: OAuth2ProviderInfo,
  redirectUri?: string,
  workspaceId?: string,
): string {
  if (!redirectUri && !workspaceId) return info.loginUrl;
  const params = new URLSearchParams();
  if (redirectUri) params.set('redirect_uri', redirectUri);
  if (workspaceId) params.set('workspace_id', workspaceId);
  const sep = info.loginUrl.includes('?') ? '&' : '?';
  return `${info.loginUrl}${sep}${params.toString()}`;
}

function getOAuthButtonLabel(provider: string, displayName: string): string {
  const labels: Record<string, string> = {
    google: '구글',
    naver: '네이버',
    kakao: '카카오',
    apple: '애플',
  };
  const key = provider.toLowerCase();
  const name = labels[key] ?? displayName;
  return `${name} 계정으로 로그인`;
}

export interface LoginFormCustomProps {
  config: AuthClientConfig;
  workspaceId?: string;
  redirectUri?: string;
  providers?: OAuth2ProviderName[];
  workspaceName?: string;
  registerHref?: string;
  resetPasswordHref?: string;
  onSuccess?: () => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
  components?: LoginFormCustomComponents;
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
  <div className={className} style={style} data-testid="login-form-custom">
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
  'data-testid'?: string;
}> = (props) => <button {...props} />;

const DefaultAlert: React.FC<{ children: React.ReactNode; role?: 'alert' }> = ({ children, role = 'alert' }) => (
  <div role={role}>{children}</div>
);

const DefaultLink: React.FC<{ href: string; children: React.ReactNode; 'data-testid'?: string }> = (props) => (
  <a {...props} />
);

const DefaultOAuthButton: React.FC<{
  href: string;
  provider: string;
  label: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}> = ({ href, label, 'data-testid': testId, children }) => (
  <a href={href} role="button" data-testid={testId}>
    {children}
    {label}
  </a>
);

/**
 * 로그인 폼 주입용 래퍼. useLoginForm 로직 + components로 UI만 주입.
 * components 미지정 시 기본 div/input/button으로 동작.
 */
export function LoginFormCustom({
  config,
  workspaceId,
  redirectUri,
  providers: providersProp,
  workspaceName,
  registerHref,
  resetPasswordHref,
  onSuccess,
  components: componentsProp,
}: LoginFormCustomProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
    oauthProviders,
  } = useLoginForm({
    config,
    workspaceId,
    redirectUri,
    providers: providersProp,
    onSuccess,
  });

  const Container = componentsProp?.Container ?? DefaultContainer;
  const Card = componentsProp?.Card ?? DefaultCard;
  const Input = componentsProp?.Input ?? DefaultInput;
  const Label = componentsProp?.Label ?? DefaultLabel;
  const Button = componentsProp?.Button ?? DefaultButton;
  const Alert = componentsProp?.Alert ?? DefaultAlert;
  const Link = componentsProp?.Link ?? DefaultLink;
  const OAuthButton = componentsProp?.OAuthButton ?? DefaultOAuthButton;

  const hasFooterLinks = !!(registerHref || resetPasswordHref);

  return (
    <Container className="auth-container" style={{}}>
      <Card className="auth-card" style={{}}>
        <div className="auth-header">
          {workspaceName && <h2>{workspaceName}</h2>}
          <p>로그인</p>
        </div>

        {error && (
          <Alert role="alert">
            {error}
          </Alert>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <Label htmlFor="login-email-custom">이메일</Label>
            <Input
              id="login-email-custom"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              data-testid="login-email"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="login-password-custom">비밀번호</Label>
            <Input
              id="login-password-custom"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              data-testid="login-password"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading} data-testid="login-submit">
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        {hasFooterLinks && (
          <div className="auth-footer">
            {registerHref && (
              <Link href={registerHref} data-testid="login-register-link">
                계정이 없으신가요?
              </Link>
            )}
            {resetPasswordHref && (
              <Link href={resetPasswordHref} data-testid="login-reset-password-link">
                비밀번호를 잊으셨나요?
              </Link>
            )}
          </div>
        )}

        {oauthProviders.length > 0 && (
          <div className="social-login">
            <p><span>or</span></p>
            <div className="social-buttons">
              {oauthProviders.map((p) => {
                const url =
                  providersProp != null && providersProp.length > 0
                    ? p.loginUrl
                    : buildOAuth2Link(p, redirectUri, workspaceId);
                const label = getOAuthButtonLabel(p.provider, p.displayName);
                return (
                  <OAuthButton
                    key={p.provider}
                    href={url}
                    provider={p.provider}
                    label={label}
                    data-testid={`oauth2-${p.provider.toLowerCase()}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </Container>
  );
}
