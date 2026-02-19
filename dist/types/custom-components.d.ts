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
    'data-testid'?: string;
}
export interface AuthAlertProps {
    children: ReactNode;
    role?: 'alert';
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
