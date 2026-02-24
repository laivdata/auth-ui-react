import React, { useState } from 'react';
import type { AuthClientConfig } from './client';
import type { WorkspaceJoinFormCustomComponents } from './types/custom-components';

export interface WorkspaceJoinFormCustomProps {
  config: AuthClientConfig;
  workspaceId: string;
  onSuccess?: () => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
  components?: WorkspaceJoinFormCustomComponents;
}

const DefaultContainer: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => (
  <div className={className} style={style} data-testid="workspace-join-form-custom">
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

const DefaultAlert: React.FC<{ children: React.ReactNode; role?: 'alert' }> = ({ children, role = 'alert' }) => (
  <p role={role}>{children}</p>
);

/**
 * 워크스페이스 가입 폼 주입용 래퍼. WorkspaceJoinForm과 동일 로직 + components로 UI만 주입.
 */
export function WorkspaceJoinFormCustom({
  config,
  workspaceId,
  onSuccess,
  components: componentsProp,
}: WorkspaceJoinFormCustomProps) {
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

  const Container = componentsProp?.Container ?? DefaultContainer;
  const Input = componentsProp?.Input ?? DefaultInput;
  const Button = componentsProp?.Button ?? DefaultButton;
  const Alert = componentsProp?.Alert ?? DefaultAlert;

  return (
    <Container className="" style={{}}>
      <form onSubmit={handleSubmit}>
        <Input
          id="workspace-join-secret-custom"
          type="password"
          name="secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="가입 비밀번호 (필요한 경우)"
          data-testid="workspace-join-secret"
        />
        {error && (
          <Alert role="alert">
            {error}
          </Alert>
        )}
        <Button type="submit" disabled={loading} data-testid="workspace-join-submit">
          {loading ? '가입 중...' : '워크스페이스 가입'}
        </Button>
      </form>
    </Container>
  );
}
