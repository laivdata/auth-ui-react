import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import type { AuthFormLayoutProps } from './form-layout-props';

export interface WorkspaceJoinFormProps extends Pick<AuthFormLayoutProps, 'className' | 'style' | 'formClassName' | 'formStyle'> {
  config: AuthClientConfig;
  workspaceId: string;
  onSuccess?: () => void;
}

/**
 * 워크스페이스 가입 폼 (비밀번호가 필요한 경우 secret 입력).
 */
export function WorkspaceJoinForm({
  config,
  workspaceId,
  onSuccess,
  className,
  style,
  formClassName,
  formStyle,
}: WorkspaceJoinFormProps) {
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/workspaces/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, ...(secret ? { secret } : {}) }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '가입 실패');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className} style={style} data-testid="workspace-join-form">
      <form className={formClassName} style={formStyle} onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="가입 비밀번호 (필요한 경우)"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          data-testid="workspace-join-secret"
        />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading} data-testid="workspace-join-submit">
          {loading ? '가입 중...' : '워크스페이스 가입'}
        </button>
      </form>
    </div>
  );
}
