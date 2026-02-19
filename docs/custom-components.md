# 주입용 디자인 컴포넌트 규격

`LoginFormCustom`으로 로그인 폼을 렌더할 때, 자체 디자인 시스템(카드·입력·버튼 등)을 쓰려면 **규격에 맞는 컴포넌트**를 `components` prop으로 넘기면 됩니다.  
넘기지 않은 슬롯은 래퍼 기본 요소(div, input, button 등)로 렌더됩니다.

- **사용처**: `LoginFormCustom`의 `components` prop (`LoginFormCustomComponents` 타입)
- **타입 import**: `@laivdata/auth-ui-react`에서 각 `Auth*Props` 및 `LoginFormCustomComponents` export

---

## 전체 슬롯 목록

| 슬롯 키 | 규격 타입 | 용도 |
|--------|-----------|------|
| `Container` | `AuthContainerProps` | 폼 전체를 감싸는 최상위 레이아웃 |
| `Card` | `AuthCardProps` | 로그인 카드(헤더·폼·푸터·소셜 영역 포함) 래퍼 |
| `Input` | `AuthInputProps` | 이메일·비밀번호 입력 필드 |
| `Label` | `AuthLabelProps` | 입력 필드 라벨 |
| `Button` | `AuthButtonProps` | 로그인 제출 버튼 |
| `Alert` | `AuthAlertProps` | 에러 메시지 영역 |
| `Link` | `AuthLinkProps` | 푸터 링크(회원가입·비밀번호 재설정) |
| `OAuthButton` | `AuthOAuthButtonProps` | 소셜 로그인 버튼(구글·네이버·카카오 등) |

---

## 규격 상세

### Container

폼 전체를 감싸는 래퍼. 한 개만 사용됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `children` | `ReactNode` | ✓ | 카드 등 하위 콘텐츠 |
| `className` | `string` | | 래퍼에 적용할 클래스 |
| `style` | `React.CSSProperties` | | 인라인 스타일 |

---

### Card

헤더·에러·폼·푸터·소셜 로그인을 모두 담는 카드 영역. 한 개만 사용됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `children` | `ReactNode` | ✓ | 헤더·폼·푸터·소셜 등 |
| `className` | `string` | | 카드에 적용할 클래스 |
| `style` | `React.CSSProperties` | | 인라인 스타일 |

---

### Input

이메일·비밀번호 필드에 사용됩니다. `type`은 `'email'` 또는 `'password'`가 전달됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | `string` | ✓ | input의 id (접근성·label 연결) |
| `type` | `'text' \| 'email' \| 'password'` | ✓ | 입력 타입 |
| `name` | `string` | ✓ | name 속성 |
| `value` | `string` | ✓ | 제어 컴포넌트 값 |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | ✓ | 값 변경 핸들러 |
| `placeholder` | `string` | | placeholder |
| `required` | `boolean` | | 필수 여부 |
| `autoComplete` | `string` | | 예: `email`, `current-password` |
| `data-testid` | `string` | | 테스트 id |

---

### Label

입력 필드와 연결되는 라벨. `htmlFor`는 해당 Input의 `id`와 일치해야 합니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `htmlFor` | `string` | ✓ | 연결할 input의 id |
| `children` | `ReactNode` | ✓ | 라벨 텍스트(예: "이메일", "비밀번호") |

---

### Button

로그인 제출 버튼. `type="submit"`으로 전달됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | `'submit' \| 'button'` | ✓ | 로그인 버튼은 `submit` |
| `disabled` | `boolean` | | 로딩 중일 때 true |
| `children` | `ReactNode` | ✓ | 버튼 텍스트(예: "로그인", "로그인 중...") |
| `data-testid` | `string` | | 테스트 id |

---

### Alert

에러 메시지를 표시하는 영역. 에러가 있을 때만 렌더됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `children` | `ReactNode` | ✓ | 에러 메시지 텍스트 |
| `role` | `'alert'` | | 접근성용, 기본 권장 |

---

### Link

푸터의 "계정이 없으신가요?", "비밀번호를 잊으셨나요?" 링크. `registerHref` / `resetPasswordHref`에 따라 렌더됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `href` | `string` | ✓ | 이동할 URL |
| `children` | `ReactNode` | ✓ | 링크 텍스트 |
| `data-testid` | `string` | | 테스트 id |

---

### OAuthButton

소셜 로그인 버튼(구글·네이버·카카오 등). 제공자마다 한 번씩 렌더됩니다.

| prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `href` | `string` | ✓ | OAuth 리다이렉트 URL |
| `provider` | `string` | ✓ | 예: `GOOGLE`, `NAVER`, `KAKAO` |
| `label` | `string` | ✓ | 버튼에 쓸 문구(예: "구글 계정으로 로그인") |
| `children` | `ReactNode` | | 아이콘 등 (선택) |
| `data-testid` | `string` | | 테스트 id (예: `oauth2-google`) |

---

## 사용 예시

필수 prop만 받아서 자체 컴포넌트로 감싸면 됩니다.

```tsx
import {
  LoginFormCustom,
  type LoginFormCustomComponents,
  type AuthCardProps,
  type AuthButtonProps,
  type AuthInputProps,
} from '@laivdata/auth-ui-react';

const MyCard: React.FC<AuthCardProps> = ({ children, className, style }) => (
  <div className={className} style={style} data-theme="my-app">
    {children}
  </div>
);

const MyButton: React.FC<AuthButtonProps> = ({ type, disabled, children, ...rest }) => (
  <YourDesignSystemButton type={type} disabled={disabled} {...rest}>
    {children}
  </YourDesignSystemButton>
);

const MyInput: React.FC<AuthInputProps> = (props) => (
  <YourDesignSystemInput {...props} />
);

<LoginFormCustom
  config={config}
  providers={['GOOGLE', 'NAVER']}
  registerHref="/register"
  resetPasswordHref="/reset-password-request"
  onSuccess={() => navigate('/')}
  components={{
    Card: MyCard,
    Button: MyButton,
    Input: MyInput,
  }}
/>
```

일부만 주입해도 됩니다. 주입하지 않은 슬롯은 기본 div/input/button으로 렌더됩니다.

```tsx
components={{ Card: MyCard, Button: MyButton }}
```

---

## 타입 import

모든 규격 타입은 패키지에서 export됩니다.

```ts
import type {
  LoginFormCustomComponents,
  AuthContainerProps,
  AuthCardProps,
  AuthInputProps,
  AuthLabelProps,
  AuthButtonProps,
  AuthAlertProps,
  AuthLinkProps,
  AuthOAuthButtonProps,
} from '@laivdata/auth-ui-react';
```

---

## 참고

- **스타일만 바꾸기**: [스타일 커스터마이징 (CSS 변수)](styling.md)
- **완전 자체 UI**: `useLoginForm` 훅으로 상태·제출·OAuth 목록만 받아서 폼을 직접 구성할 수 있습니다. [README – 커스터마이징](../README.md#커스터마이징)
