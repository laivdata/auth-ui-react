import type { CSSProperties } from 'react';
/**
 * 폼 컴포넌트(LoginForm, RegisterForm 등)에 공통으로 적용할 수 있는
 * 레이아웃·스타일 주입용 optional props.
 * 기존 동작은 그대로 두고, 전달 시 해당 요소의 className/style에 병합됩니다.
 */
export interface AuthFormLayoutProps {
    /** 최상위 래퍼에 적용 (card 레이아웃 시 카드, fullpage 시 컨테이너) */
    className?: string;
    /** fullpage 레이아웃일 때 auth-container에 적용 */
    containerClassName?: string;
    /** auth-card에 적용 */
    cardClassName?: string;
    /** auth-form에 적용 */
    formClassName?: string;
    /** auth-header에 적용 */
    headerClassName?: string;
    /** auth-footer에 적용 */
    footerClassName?: string;
    style?: CSSProperties;
    containerStyle?: CSSProperties;
    cardStyle?: CSSProperties;
    formStyle?: CSSProperties;
    headerStyle?: CSSProperties;
    footerStyle?: CSSProperties;
}
export declare function mergeClassName(base: string, extra?: string): string;
