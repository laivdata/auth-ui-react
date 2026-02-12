import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoginForm } from './LoginForm';

const config = { authServerBaseUrl: 'https://auth.example.com' };

describe('LoginForm', () => {
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
});
