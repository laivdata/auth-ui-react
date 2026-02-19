import { useState, useEffect } from 'react';
import {
  getAvailableOAuth2Providers,
  getOAuth2ProviderRedirectUrl,
  type AuthClientConfig,
  type OAuth2ProviderInfo,
} from '../client';

export type OAuth2ProviderName = 'GOOGLE' | 'NAVER' | 'KAKAO';

export interface UseLoginFormConfig {
  config: AuthClientConfig;
  workspaceId?: string;
  redirectUri?: string;
  /** OAuth2 버튼을 BE 조회 대신 직접 지정 (미지정 시 config.authServerBaseUrl 기준 GET /api/auth/oauth2/providers 자동 조회) */
  providers?: OAuth2ProviderName[];
  onSuccess?: () => void;
}

export interface UseLoginFormReturn {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string | null;
  setError: (v: string | null) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  oauthProviders: OAuth2ProviderInfo[];
}

/**
 * 로그인 폼 상태·제출·OAuth2 제공자 목록을 담당하는 훅.
 * 주입용 UI(LoginFormCustom 등)에서 디자인 컴포넌트만 주입하고 이 훅으로 로직을 연결할 때 사용.
 */
export function useLoginForm({
  config,
  workspaceId,
  redirectUri,
  providers: providersProp,
  onSuccess,
}: UseLoginFormConfig): UseLoginFormReturn {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oauthProviders, setOauthProviders] = useState<OAuth2ProviderInfo[]>([]);

  const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');

  useEffect(() => {
    if (providersProp != null && providersProp.length > 0) {
      setOauthProviders(
        providersProp.map((p) => ({
          provider: p,
          displayName: p.charAt(0) + p.slice(1).toLowerCase(),
          enabled: true,
          loginUrl: getOAuth2ProviderRedirectUrl(config, {
            provider: p,
            redirectUri,
            workspaceId,
          }),
        })),
      );
      return;
    }
    let cancelled = false;
    getAvailableOAuth2Providers(config).then((list) => {
      if (!cancelled) setOauthProviders(list);
    });
    return () => {
      cancelled = true;
    };
  }, [baseUrl, providersProp, config.authServerBaseUrl, redirectUri, workspaceId]);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    handleSubmit,
    oauthProviders,
  };
}
