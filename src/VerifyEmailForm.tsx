import React, { useState, useEffect, useRef } from 'react';
import type { AuthClientConfig } from './client';

export interface VerifyEmailFormProps {
  config: AuthClientConfig;
  /** URL 쿼리 문자열 (예: location.search). 없으면 자동으로 window.location.search 사용 */
  search?: string;
  onSuccess?: () => void;
  onFailure?: (message: string) => void;
}

/**
 * 이메일 인증 링크 랜딩 페이지용 폼.
 * URL 쿼리에서 email, code(, context, workspaceId)를 읽어 API 검증 후 성공/실패 UI 표시.
 */
export function VerifyEmailForm({
  config,
  search,
  onSuccess,
  onFailure,
}: VerifyEmailFormProps) {
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

  if (status === 'success') {
    return (
      <div data-testid="verify-email-success">
        <p role="status">{message}</p>
        {onSuccess == null && (
          <a href="/login" data-testid="verify-email-login-link">로그인하기</a>
        )}
      </div>
    );
  }

  return (
    <div data-testid="verify-email-form">
      {emailFromUrl && <p>이메일: {emailFromUrl}</p>}
      {!codeFromUrl && (
        <input
          type="text"
          placeholder="인증 코드 6자리"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          data-testid="verify-email-code-input"
        />
      )}
      {(codeFromUrl || codeInput) && status === 'idle' && !codeFromUrl && (
        <button type="button" onClick={submitVerify} data-testid="verify-email-submit">
          인증하기
        </button>
      )}
      {status === 'loading' && <p>인증 처리 중...</p>}
      {status === 'error' && message && <p role="alert">{message}</p>}
    </div>
  );
}
