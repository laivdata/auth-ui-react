import type { ComponentType, ReactNode } from 'react';

/** 주입용 레이아웃·폼 컴포넌트 계약. 미제공 시 래퍼 기본 렌더 사용. */

export interface AuthContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AuthCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AuthInputProps {
  id: string;
  type: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  'data-testid'?: string;
}

export interface AuthLabelProps {
  htmlFor: string;
  children: ReactNode;
}

export interface AuthButtonProps {
  type: 'submit' | 'button';
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
  'data-testid'?: string;
}

export interface AuthAlertProps {
  children: ReactNode;
  role?: 'alert' | 'status';
}

export interface AuthLinkProps {
  href: string;
  children: ReactNode;
  'data-testid'?: string;
}

export interface AuthOAuthButtonProps {
  href: string;
  provider: string;
  label: string;
  children?: ReactNode;
  'data-testid'?: string;
}

export interface LoginFormCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  Card?: ComponentType<AuthCardProps>;
  Input?: ComponentType<AuthInputProps>;
  Label?: ComponentType<AuthLabelProps>;
  Button?: ComponentType<AuthButtonProps>;
  Alert?: ComponentType<AuthAlertProps>;
  Link?: ComponentType<AuthLinkProps>;
  OAuthButton?: ComponentType<AuthOAuthButtonProps>;
}

export interface RegisterFormCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  Card?: ComponentType<AuthCardProps>;
  Input?: ComponentType<AuthInputProps>;
  Label?: ComponentType<AuthLabelProps>;
  Button?: ComponentType<AuthButtonProps>;
  Alert?: ComponentType<AuthAlertProps>;
  Link?: ComponentType<AuthLinkProps>;
}

export interface WorkspaceJoinFormCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  Input?: ComponentType<AuthInputProps>;
  Button?: ComponentType<AuthButtonProps>;
  Alert?: ComponentType<AuthAlertProps>;
}

export interface VerifyEmailFormCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  Input?: ComponentType<AuthInputProps>;
  Button?: ComponentType<AuthButtonProps>;
  Alert?: ComponentType<AuthAlertProps>;
  Link?: ComponentType<AuthLinkProps>;
}

export interface ResendVerificationFormCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  Input?: ComponentType<AuthInputProps>;
  Button?: ComponentType<AuthButtonProps>;
  Alert?: ComponentType<AuthAlertProps>;
}

export interface RequestPasswordResetFormCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  Card?: ComponentType<AuthCardProps>;
  Input?: ComponentType<AuthInputProps>;
  Label?: ComponentType<AuthLabelProps>;
  Button?: ComponentType<AuthButtonProps>;
  Alert?: ComponentType<AuthAlertProps>;
  Link?: ComponentType<AuthLinkProps>;
}

export interface ResetPasswordFormCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  Card?: ComponentType<AuthCardProps>;
  Input?: ComponentType<AuthInputProps>;
  Label?: ComponentType<AuthLabelProps>;
  Button?: ComponentType<AuthButtonProps>;
  Alert?: ComponentType<AuthAlertProps>;
  Link?: ComponentType<AuthLinkProps>;
}

export interface CallbackPageCustomComponents {
  Container?: ComponentType<AuthContainerProps>;
  LoadingView?: ComponentType<Record<string, never>>;
  SuccessView?: ComponentType<Record<string, never>>;
  ErrorView?: ComponentType<{ children: ReactNode }>;
}
