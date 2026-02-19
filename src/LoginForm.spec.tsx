import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from './LoginForm';

const config = { authServerBaseUrl: 'https://auth.example.com' };

describe('LoginForm', () => {
  beforeEach(() => {
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

  it('should render email and password inputs and submit button', () => {
    render(<LoginForm config={config} />);
    expect(screen.getByTestId('login-email')).toBeDefined();
    expect(screen.getByTestId('login-password')).toBeDefined();
    expect(screen.getByTestId('login-submit')).toBeDefined();
  });

  it('should render OAuth2 provider buttons when providers prop is given', () => {
    render(<LoginForm config={config} providers={['GOOGLE', 'NAVER', 'KAKAO']} />);
    expect(screen.getByTestId('oauth2-google')).toBeDefined();
    expect(screen.getByTestId('oauth2-naver')).toBeDefined();
    expect(screen.getByTestId('oauth2-kakao')).toBeDefined();
  });

  it('should apply cardClassName to the card element', () => {
    const { container } = render(
      <LoginForm config={config} layout="card" cardClassName="my-custom-card" />,
    );
    const card = container.querySelector('[data-testid="login-form"]');
    expect(card).toBeDefined();
    expect(card?.className).toContain('my-custom-card');
    expect(card?.className).toContain('auth-card');
  });

  it('should apply containerClassName when layout is fullpage', () => {
    const { container } = render(
      <LoginForm config={config} layout="fullpage" containerClassName="my-container" />,
    );
    const wrapper = container.querySelector('.my-container');
    expect(wrapper).toBeDefined();
    expect(wrapper?.className).toContain('auth-container');
  });
});
