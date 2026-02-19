import React from 'react';
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginFormCustom } from './LoginFormCustom';

const config = { authServerBaseUrl: 'https://auth.example.com' };

describe('LoginFormCustom', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (typeof url === 'string' && url.includes('/api/auth/oauth2/providers')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ providers: [] }) });
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    }));
  });

  it('should render email and password inputs and submit button', () => {
    render(<LoginFormCustom config={config} providers={['GOOGLE']} />);
    expect(screen.getByTestId('login-email')).toBeDefined();
    expect(screen.getByTestId('login-password')).toBeDefined();
    expect(screen.getByTestId('login-submit')).toBeDefined();
  });

  it('should render using custom components when provided', () => {
    const Card = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-card">{children}</div>
    );
    render(
      <LoginFormCustom
        config={config}
        providers={['GOOGLE']}
        components={{ Card }}
      />,
    );
    expect(screen.getByTestId('custom-card')).toBeDefined();
    expect(screen.getByTestId('login-email')).toBeDefined();
  });

  it('should call onSuccess when login succeeds with custom components', async () => {
    const onSuccess = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (typeof url === 'string' && url.includes('/api/auth/login')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        if (typeof url === 'string' && url.includes('/api/auth/oauth2/providers')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ providers: [] }) });
        }
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
      }),
    );
    render(
      <LoginFormCustom
        config={config}
        providers={['GOOGLE']}
        onSuccess={onSuccess}
      />,
    );
    await userEvent.type(screen.getByTestId('login-email'), 'u@example.com');
    await userEvent.type(screen.getByTestId('login-password'), 'pwd');
    await userEvent.click(screen.getByTestId('login-submit'));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
