import React, { useState, useEffect, useRef } from 'react';
import type { AuthClientConfig } from './client';
import type { VerifyEmailFormCustomComponents } from './types/custom-components';

export interface VerifyEmailFormCustomProps {
  config: AuthClientConfig;
  search?: string;
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
  /** 주입 시 커스텀 UI, 미주입 시 기본 div/input/button 사용 */
  components?: VerifyEmailFormCustomComponents;
}

const DefaultContainer: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className,
  style,
}) => (
  <div className={className} style={style} data-testid="verify-email-form-custom">
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
  onClick?: () => void;
  'data-testid'?: string;
}> = (props) => <button {...props} />;

const DefaultAlert: React.FC<{ children: React.ReactNode; role?: 'alert' | 'status' }> = ({ children, role }) => (
  <p role={role}>{children}</p>
);

const DefaultLink: React.FC<{ href: string; children: React.ReactNode; 'data-testid'?: string }> = (props) => (
  <a {...props} />
);

/**
 * 이메일 인증 폼 주입용 래퍼. VerifyEmailForm과 동일 로직 + components로 UI만 주입.
 */
export function VerifyEmailFormCustom({
  config,
  search,
  onSuccess,
  onFailure,
  components: componentsProp,
}: VerifyEmailFormCustomProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const autoSubmitted = useRef(false);

  const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
  const searchStr = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(searchStr.startsWith('?') ? searchStr.slice(1) : searchStr);
  const emailFromUrl = params.get('email') ?? '';
  const codeFromUrl = params.get('code') ?? '';
  const workspaceIdFromUrl = params.get('workspaceId') ?? undefined;

  const codeToVerify = codeFromUrl || codeInput;

  const submitVerify = async () => {
    if (!codeToVerify.trim()) {
      setStatus('error');
      setMessage('인증 코드를 입력하세요.');
      return;
    }
    setStatus('loading');
    setMessage(null);
    try {
      const res = await fetch(`${baseUrl}/api/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToVerify.trim(), workspaceId: workspaceIdFromUrl }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '인증에 실패했습니다.');
      setStatus('success');
      setMessage('이메일 인증이 완료되었습니다.');
      onSuccess?.();
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : '인증에 실패했습니다.';
      setMessage(msg);
      onFailure?.(msg);
    }
  };

  useEffect(() => {
    if (codeFromUrl && status === 'idle' && !autoSubmitted.current) {
      autoSubmitted.current = true;
      submitVerify();
    }
  }, []);

  const Container = componentsProp?.Container ?? DefaultContainer;
  const Input = componentsProp?.Input ?? DefaultInput;
  const Button = componentsProp?.Button ?? DefaultButton;
  const Alert = componentsProp?.Alert ?? DefaultAlert;
  const Link = componentsProp?.Link ?? DefaultLink;

  if (status === 'success') {
    return (
      <Container className="" style={{}}>
        <div data-testid="verify-email-success">
          <Alert role="status">{message}</Alert>
          {onSuccess == null && (
            <Link href="/login" data-testid="verify-email-login-link">
              로그인하기
            </Link>
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container className="" style={{}}>
      {emailFromUrl && <p>이메일: {emailFromUrl}</p>}
      {!codeFromUrl && (
        <Input
          id="verify-email-code-custom"
          type="text"
          name="code"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="인증 코드 6자리"
          data-testid="verify-email-code-input"
        />
      )}
      {(codeFromUrl || codeInput) && status === 'idle' && !codeFromUrl && (
        <Button type="button" onClick={submitVerify} data-testid="verify-email-submit">
          인증하기
        </Button>
      )}
      {status === 'loading' && <p>인증 처리 중...</p>}
      {status === 'error' && message && (
        <Alert role="alert">
          {message}
        </Alert>
      )}
    </Container>
  );
}
