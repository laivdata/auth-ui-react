import React, { useEffect, useRef, useState } from 'react';
import {
  getCallbackParams,
  getCallbackRedirectUri,
  type AuthClientConfig,
} from './client';
import type { CallbackPageCustomComponents } from './types/custom-components';

export interface CallbackPageCustomProps {
  config: AuthClientConfig;
  search?: string;
  defaultPath?: string;
  workspaceJoinPath?: string;
  onSuccess?: (redirectUri?: string) => void;
  onFailure?: (message: string) => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div 사용 */
  components?: CallbackPageCustomComponents;
}

const DefaultContainer: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => (
  <div className={className} style={style} data-testid="callback-page-custom">
    {children}
  </div>
);

const DefaultLoadingView: React.FC<Record<string, never>> = () => (
  <span data-testid="callback-loading">로그인 처리 중...</span>
);

const DefaultSuccessView: React.FC<Record<string, never>> = () => (
  <span data-testid="callback-success">로그인되었습니다.</span>
);

const DefaultErrorView: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p role="alert" data-testid="callback-error">{children}</p>
);

/**
 * OAuth2 콜백 페이지 주입용 래퍼. CallbackPage와 동일 로직 + components로 UI만 주입.
 */
export function CallbackPageCustom({
  config,
  search,
  defaultPath = '/',
  workspaceJoinPath = '/workspace-join',
  onSuccess,
  onFailure,
  components: componentsProp,
}: CallbackPageCustomProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);
  const redirectDoneRef = useRef(false);

  useEffect(() => {
    const searchStr = search ?? (typeof window !== 'undefined' ? window.location.search : '');
    const parsed = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
    const params = new URLSearchParams(parsed);
    const { code, error: errorParam, error_description } = getCallbackParams(
      searchStr.startsWith('?') ? searchStr : `?${searchStr}`,
    );
    const workspaceIdFromQuery =
      params.get('workspace_id') ?? params.get('workspaceId') ?? params.get('workspace-id') ?? undefined;

    if (errorParam) {
      const errMsg = error_description || errorParam || 'OAuth2 인증 중 오류가 발생했습니다.';
      setStatus('error');
      setMessage(errMsg);
      onFailure?.(errMsg);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('code가 없습니다. 로그인 페이지에서 다시 시도해주세요.');
      onFailure?.('code가 없습니다.');
      return;
    }

    const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
    const redirectUri = getCallbackRedirectUri({
      authServerBaseUrl: config.authServerBaseUrl,
      appBaseUrl: config.appBaseUrl,
      callbackPath: config.callbackPath,
    });

    (async () => {
      if (redirectDoneRef.current) return;
      try {
        const res = await fetch(`${baseUrl}/api/auth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '토큰 교환에 실패했습니다.');

        if (redirectDoneRef.current) return;
        setStatus('success');
        const user = data.user as { wsid?: string } | undefined;
        let hasWorkspace = !!user?.wsid;
        let path = hasWorkspace ? defaultPath : workspaceJoinPath;

        if (!hasWorkspace && workspaceIdFromQuery && typeof window !== 'undefined') {
          try {
            const selectRes = await fetch(`${baseUrl}/api/auth/workspace/select`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ workspaceId: workspaceIdFromQuery }),
              credentials: 'include',
            });
            const selectData = await selectRes.json().catch(() => ({}));
            if (selectRes.ok && selectData?.success !== false) {
              hasWorkspace = true;
              path = defaultPath;
            }
          } catch {
            // ignore
          }
        }

        if (redirectDoneRef.current) return;
        if (!hasWorkspace && workspaceIdFromQuery && path && typeof window !== 'undefined') {
          const joinUrl = path.startsWith('http') ? new URL(path) : new URL(path, window.location.origin);
          joinUrl.searchParams.set('workspaceId', workspaceIdFromQuery);
          path = joinUrl.toString();
        }
        const href =
          typeof window !== 'undefined'
            ? path.startsWith('http')
              ? path
              : `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`
            : '';
        if (href) {
          redirectDoneRef.current = true;
          window.location.href = href;
          return;
        }
        onSuccess?.();
      } catch (err) {
        if (redirectDoneRef.current) return;
        setStatus('error');
        const msg = err instanceof Error ? err.message : '토큰 교환에 실패했습니다.';
        setMessage(msg);
        onFailure?.(msg);
      }
    })();
  }, [config.authServerBaseUrl, config.appBaseUrl, config.callbackPath, defaultPath, workspaceJoinPath, onSuccess, onFailure, search]);

  const Container = componentsProp?.Container ?? DefaultContainer;
  const LoadingView = componentsProp?.LoadingView ?? DefaultLoadingView;
  const SuccessView = componentsProp?.SuccessView ?? DefaultSuccessView;
  const ErrorView = componentsProp?.ErrorView ?? DefaultErrorView;

  if (status === 'loading') {
    return (
      <Container className="" style={{}}>
        <LoadingView />
      </Container>
    );
  }
  if (status === 'success') {
    return (
      <Container className="" style={{}}>
        <SuccessView />
      </Container>
    );
  }
  return (
    <Container className="" style={{}}>
      <ErrorView>{message}</ErrorView>
    </Container>
  );
}
