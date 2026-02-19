import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from './useLoginForm';

const config = { authServerBaseUrl: 'https://auth.example.com' };

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (typeof url === 'string' && url.includes('/api/auth/oauth2/providers')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ providers: [] }) });
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
      }),
    );
  });

  it('should return initial state', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { result } = renderHook(() =>
      useLoginForm({ config, providers: ['GOOGLE'] }),
    );
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.oauthProviders).toHaveLength(1);
    expect(result.current.oauthProviders[0].provider).toBe('GOOGLE');
  });

  it('should update email and password', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { result } = renderHook(() =>
      useLoginForm({ config, providers: ['GOOGLE'] }),
    );
    act(() => {
      result.current.setEmail('a@b.com');
    });
    act(() => {
      result.current.setPassword('secret');
    });
    expect(result.current.email).toBe('a@b.com');
    expect(result.current.password).toBe('secret');
  });

  it('should set oauthProviders when providers prop is given', () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { result } = renderHook(() =>
      useLoginForm({
        config,
        providers: ['GOOGLE', 'NAVER'],
        redirectUri: 'https://app.example/cb',
        workspaceId: 'ws1',
      }),
    );
    expect(result.current.oauthProviders).toHaveLength(2);
    expect(result.current.oauthProviders[0].provider).toBe('GOOGLE');
    expect(result.current.oauthProviders[0].loginUrl).toContain(
      'api/auth/oauth2/provider/google',
    );
    expect(result.current.oauthProviders[0].loginUrl).toContain(
      'redirect_uri=',
    );
    expect(result.current.oauthProviders[0].loginUrl).toContain(
      'workspace_id=ws1',
    );
  });

  it('should call onSuccess when login succeeds', async () => {
    const onSuccess = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) }));
    const { result } = renderHook(() =>
      useLoginForm({ config, providers: ['GOOGLE'], onSuccess }),
    );
    act(() => {
      result.current.setEmail('u@example.com');
      result.current.setPassword('pwd');
    });
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should set error when login fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      }),
    );
    const { result } = renderHook(() =>
      useLoginForm({ config, providers: ['GOOGLE'] }),
    );
    act(() => {
      result.current.setEmail('u@example.com');
      result.current.setPassword('wrong');
    });
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    });
    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.loading).toBe(false);
  });
});
