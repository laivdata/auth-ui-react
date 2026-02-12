import React, { useState, useEffect } from 'react';
import {
  getAvailableOAuth2Providers,
  getOAuth2ProviderRedirectUrl,
  type AuthClientConfig,
  type OAuth2ProviderInfo,
} from './client';

type OAuth2ProviderName = 'GOOGLE' | 'NAVER' | 'KAKAO';

/** 인증 서버 FE와 동일한 OAuth 버튼 문구 (한글) */
const OAUTH_BUTTON_LABEL: Record<string, string> = {
  google: '구글',
  naver: '네이버',
  kakao: '카카오',
  apple: '애플',
};

function getOAuthButtonLabel(provider: string, displayName: string): string {
  const key = provider.toLowerCase();
  const name = OAUTH_BUTTON_LABEL[key] ?? displayName;
  return `${name} 계정으로 로그인`;
}

/** 소셜 로그인 아이콘 (인증 서버 login.html과 동일) */
function OAuthIcon({ provider }: { provider: string }) {
  const p = provider.toLowerCase();
  if (p === 'naver') {
    return (
      <svg width="16" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M12.8 10.1L5.8 0H0V19H6.2V8.9L13.2 19H19V0H12.8V10.1Z" fill="white" />
      </svg>
    );
  }
  if (p === 'kakao') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 0C4.477 0 0 3.537 0 7.903C0 10.671 1.875 13.113 4.714 14.528L3.536 18.534C3.453 18.816 3.77 19.041 4.017 18.879L8.747 15.693C9.157 15.736 9.574 15.758 10 15.758C15.523 15.758 20 12.222 20 7.903C20 3.537 15.523 0 10 0Z"
          fill="black"
        />
      </svg>
    );
  }
  if (p === 'google') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
          fill="#4285F4"
        />
        <path
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
          fill="#34A853"
        />
        <path
          d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
          fill="#FBBC05"
        />
        <path
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
          fill="#EA4335"
        />
      </svg>
    );
  }
  return null;
}

/** loginUrl에 redirect_uri, workspace_id 쿼리 추가 */
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

export interface LoginFormProps {
  config: AuthClientConfig;
  workspaceId?: string;
  redirectUri?: string;
  /** OAuth2 버튼을 BE 조회 대신 직접 지정 (미지정 시 config.authServerBaseUrl 기준 GET /api/auth/oauth2/providers 자동 조회) */
  providers?: OAuth2ProviderName[];
  /** 헤더에 표시할 워크스페이스/앱 이름 (인증 서버 FE와 동일) */
  workspaceName?: string;
  /** 회원가입 페이지 링크 (있으면 푸터에 "계정이 없으신가요?" 표시) */
  registerHref?: string;
  /** 비밀번호 재설정 요청 페이지 링크 (있으면 푸터에 "비밀번호를 잊으셨나요?" 표시) */
  resetPasswordHref?: string;
  /** 'fullpage': auth-container 포함(전체 화면), 'card': 카드만(임베드용) */
  layout?: 'fullpage' | 'card';
  onSuccess?: () => void;
}

/**
 * 로그인 폼: 인증 서버 FE와 동일한 디자인(카드·헤더·폼·푸터·소셜).
 * config.authServerBaseUrl 기준으로 GET /api/auth/oauth2/providers를 호출해 사용 가능한 제공자만 자동 표시합니다.
 * 스타일 적용을 위해 '@laivdata/auth-ui-react/styles.css'를 import 하세요.
 */
export function LoginForm({
  config,
  workspaceId,
  redirectUri,
  providers: providersProp,
  workspaceName,
  registerHref,
  resetPasswordHref,
  layout = 'fullpage',
  onSuccess,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauth2Providers, setOauth2Providers] = useState<OAuth2ProviderInfo[]>([]);

  const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');

  useEffect(() => {
    if (providersProp != null && providersProp.length > 0) {
      setOauth2Providers(
        providersProp.map((p) => ({
          provider: p,
          displayName: p.charAt(0) + p.slice(1).toLowerCase(),
          enabled: true,
          loginUrl: getOAuth2ProviderRedirectUrl(config, { provider: p, redirectUri, workspaceId }),
        })),
      );
      return;
    }
    let cancelled = false;
    getAvailableOAuth2Providers(config).then((list) => {
      if (!cancelled) setOauth2Providers(list);
    });
    return () => {
      cancelled = true;
    };
  }, [baseUrl, providersProp, config.authServerBaseUrl, redirectUri, workspaceId]);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '로그인 실패');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  const hasFooterLinks = !!(registerHref || resetPasswordHref);

  const card = (
    <div className="auth-card" data-testid="login-form">
      <div className="auth-header">
        {workspaceName && <h2>{workspaceName}</h2>}
        <p>로그인</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleLocalLogin}>
        <div className="form-group">
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="login-email"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="login-password"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          data-testid="login-submit"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {hasFooterLinks && (
        <div className="auth-footer">
          {registerHref && (
            <a href={registerHref} data-testid="login-register-link">
              계정이 없으신가요?
            </a>
          )}
          {resetPasswordHref && (
            <a href={resetPasswordHref} data-testid="login-reset-password-link">
              비밀번호를 잊으셨나요?
            </a>
          )}
        </div>
      )}

      {oauth2Providers.length > 0 && (
        <div className="social-login">
          <p><span>or</span></p>
          <div className="social-buttons">
            {oauth2Providers.map((p) => {
              const url =
                providersProp != null
                  ? p.loginUrl
                  : buildOAuth2Link(p, redirectUri, workspaceId);
              const btnClass = `btn btn-${p.provider.toLowerCase()}`;
              const label = getOAuthButtonLabel(p.provider, p.displayName);
              return (
                <a
                  key={p.provider}
                  href={url}
                  className={btnClass}
                  role="button"
                  data-testid={`oauth2-${p.provider.toLowerCase()}`}
                >
                  <OAuthIcon provider={p.provider} />
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (layout === 'card') {
    return card;
  }

  return (
    <div className="auth-container">
      {card}
    </div>
  );
}
