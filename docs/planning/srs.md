# Software Requirements Specification

**프로젝트**: @laivdata/auth-ui-react  
**Planning 참조**: [docs/reference/250212-140000-TODOS.md](../reference/250212-140000-TODOS.md)

---

## 1. 소개

### 1.1 목적

이 문서는 auth-ui-react 패키지에 대한 요구사항을 정의한다.  
인증 UI의 **스타일 커스터마이징**과 **컴포넌트 주입 커스터마이징**을 명확히 분리하고, 모든 인증 폼/페이지에 주입 API를 제공하며, example 앱에서 세 가지 사용 패턴(기본 / 스타일 / 주입)을 시연할 수 있도록 하는 것이 목표이다.

### 1.2 범위

- **포함**: LoginForm·RegisterForm·WorkspaceJoinForm·VerifyEmailForm·ResendVerificationForm·RequestPasswordResetForm·ResetPasswordForm·CallbackPage의 스타일 전용 API와 컴포넌트 주입 전용 API 분리; *FormCustom 및 타입 추가; example 앱의 기본/스타일/주입 구성.
- **제외**: 인증 서버(agent-auth) 변경, 새로운 인증 플로우 추가, npm 배포 자동화.

### 1.3 용어 정의

| 용어 | 정의 |
|------|------|
| 스타일 커스텀 | `className`, `style`, `*ClassName`, `*Style` 등으로 레이아웃·테마만 변경. 내부 마크업 고정. |
| 컴포넌트 주입 | `components` prop으로 Container, Card, Input, Label, Button, Alert, Link 등 UI 요소를 외부 컴포넌트로 교체. |
| *FormCustom | 동일 로직(훅)을 사용하되 UI만 `components`로 주입받는 별도 컴포넌트. |

---

## 2. 전체 설명

### 2.1 제품 관점

auth-ui-react는 인증 서버(agent-auth)와 연동하는 React UI·클라이언트 유틸 라이브러리이다.  
사용자는 (1) 기본 스타일을 그대로 쓰거나, (2) CSS/className으로 스타일만 바꾸거나, (3) 컴포넌트를 주입해 UI를 완전히 자체 디자인으로 바꿀 수 있어야 한다.

### 2.2 제품 기능

- 로그인·회원가입·이메일 인증·OAuth2 콜백·워크스페이스 가입·비밀번호 재설정 요청/재설정 UI 제공.
- 스타일 전용: 모든 Form/Page는 `AuthFormLayoutProps`(className, style, *ClassName, *Style)만 받고, 컴포넌트 주입 prop은 받지 않음.
- 주입 전용: LoginFormCustom은 이미 존재; RegisterFormCustom, WorkspaceJoinFormCustom, VerifyEmailFormCustom, ResendVerificationFormCustom, RequestPasswordResetFormCustom, ResetPasswordFormCustom(, CallbackPageCustom)을 추가하여 동일한 패턴으로 UI 주입 가능.

### 2.3 사용자 특성

- 프론트엔드 개발자: 서비스 도메인 앱에 인증 UI를 임베드하고, 디자인 시스템에 맞게 스타일만 바꾸거나 컴포넌트를 주입.

### 2.4 제약사항

- React 18+.
- 기존 공개 API(LoginForm, RegisterForm 등)의 스타일 관련 props 시그니처는 유지; 제거하는 것은 `LoginForm`의 `components` prop 및 그에 따른 내부 분기만 해당.

---

## 3. 특정 요구사항

### 3.1 기능 요구사항

| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-1 | LoginForm에서 `components` prop 및 주입 분기 제거. 스타일 전용만 유지. | 필수 |
| FR-2 | LoginForm 스펙에서 “custom components when components prop is provided” 테스트 제거 또는 LoginFormCustom 테스트로 이전. | 필수 |
| FR-3 | RegisterFormCustom + RegisterFormCustomComponents 타입 정의 및 구현. | 필수 |
| FR-4 | WorkspaceJoinFormCustom + 타입 정의 및 구현. | 필수 |
| FR-5 | VerifyEmailFormCustom + 타입 정의 및 구현. | 필수 |
| FR-6 | ResendVerificationFormCustom + 타입 정의 및 구현. | 필수 |
| FR-7 | RequestPasswordResetFormCustom + 타입 정의 및 구현. | 필수 |
| FR-8 | ResetPasswordFormCustom + 타입 정의 및 구현. | 필수 |
| FR-9 | CallbackPageCustom + 타입 정의 및 구현(필요 시). | 선택 |
| FR-10 | types/custom-components.ts에 각 *FormCustomComponents 타입 추가 및 export. | 필수 |
| FR-11 | 각 Form 로직 훅 분리 검토: useRegisterForm 등으로 Form과 FormCustom이 동일 훅 사용. | 선택 |
| FR-12 | example 앱: 기본 페이지 구성(기본 컴포넌트 + styles.css) 유지. | 필수 |
| FR-13 | example 앱: 스타일 커스텀 예시(className/style만 적용한 페이지 또는 섹션) 추가. | 필수 |
| FR-14 | example 앱: 컴포넌트 주입 커스텀 예시(LoginFormCustom 등에 components 넘기는 페이지 또는 섹션) 추가. | 필수 |
| FR-15 | example 앱: 라우트 또는 탭으로 “기본 / 스타일 / 주입” 구분. | 필수 |

### 3.2 비기능 요구사항

- 기존 단위 테스트 유지 및 신규 *FormCustom에 대한 테스트 추가.
- 타입 정의는 기존 LoginFormCustomComponents 계약 패턴과 일관성 유지.

### 3.3 데이터베이스 요구사항

해당 없음(클라이언트 라이브러리).

---

## 4. 품질 속성

- **유지보수성**: 스타일 전용과 주입 전용이 코드 상 분리되어 있어 변경 시 영향 범위가 명확해야 함.
- **일관성**: 모든 *FormCustom은 동일한 components 계약 패턴(Container, Card, Input, Label, Button, Alert, Link 등)을 따름.
- **하위 호환**: 기존에 LoginForm만 사용하고 components를 쓰지 않던 사용자는 코드 변경 없이 동작 유지.
