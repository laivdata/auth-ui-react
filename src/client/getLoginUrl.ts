import type {
  AuthClientConfig,
  GetOAuth2LoginUrlOptions,
  OAuth2ProviderInfo,
} from './types';

/**
 * OAuth2 로그인 URL을 반환합니다.
 * 인증 서버 API POST /api/auth/oauth2/login-url/:provider 를 호출하여 loginUrl을 가져옵니다.
 * (실제 환경에서는 백엔드에서 이 API를 호출하거나, CORS 허용 시 클라이언트에서 호출)
 */
export async function getOAuth2LoginUrl(
  config: AuthClientConfig,
  options: GetOAuth2LoginUrlOptions,
): Promise<string> {
  const { authServerBaseUrl } = config;
  const base = authServerBaseUrl.replace(/\/$/, '');
  const url = `${base}/api/auth/oauth2/login-url/${options.provider.toLowerCase()}`;
  const body: Record<string, string> = {};
  if (options.redirectUri) body.redirectUri = options.redirectUri;
  if (options.workspaceId) body.workspaceId = options.workspaceId;
  if (options.email) body.email = options.email;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth2 login URL failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { loginUrl: string };
  return data.loginUrl;
}

/**
 * 로컬 로그인 페이지 URL (인증 서버 내장 페이지).
 * 서비스 도메인에서 로그인 페이지를 쓰지 않고 인증 서버로 보낼 때 사용.
 */
export function getLoginPageUrl(config: AuthClientConfig): string {
  const base = config.authServerBaseUrl.replace(/\/$/, '');
  return `${base}/fe/login`;
}

/** /fe/login 호출 시 넘길 쿼리 파라미터 (인증 서버 ctx 규칙과 동일) */
export interface GetAuthServerLoginUrlOptions {
  /** 워크스페이스 ID (client_id로 전달) */
  workspaceId?: string;
  /** 로그인 성공 후 돌아올 콜백 URL */
  redirectUri?: string;
  /** response_type (예: 'code') */
  responseType?: string;
  /** OAuth2 state (상관 ID 등) */
  state?: string;
}

/**
 * 인증 서버 /fe/login 페이지 URL (쿼리 파라미터 포함).
 * 로그인 후 앱으로 돌아오려면 workspaceId, redirectUri, responseType=code 를 넘기면 됨.
 */
export function getAuthServerLoginUrl(
  config: AuthClientConfig,
  options?: GetAuthServerLoginUrlOptions,
): string {
  const base = config.authServerBaseUrl.replace(/\/$/, '');
  const params = new URLSearchParams();
  if (options?.workspaceId) params.set('client_id', options.workspaceId);
  if (options?.redirectUri) params.set('redirect_uri', options.redirectUri);
  if (options?.responseType) params.set('response_type', options.responseType);
  if (options?.state) params.set('state', options.state);
  const qs = params.toString();
  return `${base}/fe/login${qs ? `?${qs}` : ''}`;
}

/**
 * 인증 서버에서 사용 가능한 OAuth2 제공자 목록을 조회합니다.
 * GET /api/auth/oauth2/providers (DISABLED_OAUTH_BUTTONS 반영).
 * config.authServerBaseUrl만 있으면 되며, 로그인 버튼을 자동으로 구성할 때 사용합니다.
 */
export async function getAvailableOAuth2Providers(
  config: AuthClientConfig,
): Promise<OAuth2ProviderInfo[]> {
  const base = config.authServerBaseUrl.replace(/\/$/, '');
  const res = await fetch(`${base}/api/auth/oauth2/providers`, {
    credentials: 'include',
  });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    providers?: Array<{
      provider?: string;
      displayName?: string;
      enabled?: boolean;
      loginUrl?: string;
    }>;
  };
  if (!Array.isArray(data?.providers)) return [];
  return data.providers
    .filter(
      (p): p is typeof p & { loginUrl: string } =>
        p.enabled !== false && typeof p.loginUrl === 'string',
    )
    .map((p) => ({
      provider: p.provider ?? '',
      displayName: p.displayName ?? p.provider ?? '',
      enabled: p.enabled !== false,
      loginUrl: p.loginUrl,
    }));
}

/**
 * OAuth2 제공자로 리다이렉트하는 URL (GET 리다이렉트 엔드포인트).
 * 인증 서버가 GET /api/auth/oauth2/provider/:provider?redirect_uri=...&workspace_id=...&email=... 로 리다이렉트해 주는 URL.
 */
export function getOAuth2ProviderRedirectUrl(
  config: AuthClientConfig,
  options: GetOAuth2LoginUrlOptions,
): string {
  const base = config.authServerBaseUrl.replace(/\/$/, '');
  const params = new URLSearchParams();
  if (options.redirectUri) params.set('redirect_uri', options.redirectUri);
  if (options.workspaceId) params.set('workspace_id', options.workspaceId);
  if (options.email) params.set('email', options.email);
  const qs = params.toString();
  return `${base}/api/auth/oauth2/provider/${options.provider.toLowerCase()}${qs ? `?${qs}` : ''}`;
}
