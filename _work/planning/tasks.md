# Task 목록

Planning 날짜: 2025-02-12

## Tasks

### TASK-001: LoginForm에서 components prop 및 주입 분기 제거
- **타입**: MODIFY
- **영역**: FE
- **설명**: LoginForm을 스타일 전용으로 되돌림. components prop, 관련 import(LoginFormCustomComponents), Default* 컴포넌트, if (componentsProp) 분기 제거. className/style 계열만 유지.
- **의존성**: 없음

#### AI 보완 명세
- 영향 범위: `src/LoginForm.tsx`
- 필요 조건: 기존 LoginFormCustom은 그대로 유지
- 테스트 요구사항: LoginForm 스펙에서 components 관련 테스트 제거 또는 LoginFormCustom으로 이전 후, 기존 4개 테스트(이메일/비밀번호/제출, OAuth2 버튼, cardClassName, containerClassName) 통과
- 산출물: `src/LoginForm.tsx` 수정

---

### TASK-002: LoginForm 스펙에서 components 주입 테스트 정리
- **타입**: MODIFY
- **영역**: FE
- **설명**: LoginForm.spec.tsx에서 "should render with custom components when components prop is provided" 제거. 커스텀 컴포넌트 검증은 LoginFormCustom.spec.tsx에만 유지.
- **의존성**: TASK-001

#### AI 보완 명세
- 영향 범위: `src/LoginForm.spec.tsx`
- 테스트 요구사항: yarn test 시 LoginForm 4개, LoginFormCustom 3개 통과
- 산출물: `src/LoginForm.spec.tsx` 수정

---

### TASK-003: RegisterFormCustom + 타입 구현
- **타입**: ADD
- **영역**: FE
- **설명**: RegisterFormCustom, RegisterFormCustomComponents 타입 추가. 슬롯: Container, Card, Input, Label, Button, Alert, Link. useRegisterForm 훅 분리 여부 검토 후 FormCustom은 훅 또는 내부 로직 공유.
- **의존성**: TASK-001, TASK-002

#### AI 보완 명세
- 영향 범위: `src/RegisterForm.tsx`, `src/types/custom-components.ts`, 신규 `src/RegisterFormCustom.tsx`, `src/index.ts`
- 유사 구현: `LoginFormCustom.tsx`, `LoginFormCustomComponents`
- 산출물: `src/RegisterFormCustom.tsx`, `src/types/custom-components.ts` 수정, `src/index.ts` export 추가

---

### TASK-004: WorkspaceJoinFormCustom + 타입 구현
- **타입**: ADD
- **영역**: FE
- **설명**: WorkspaceJoinFormCustom 및 컴포넌트 주입 타입 구현. 슬롯: Container, Input, Button, Alert 수준.
- **의존성**: TASK-003

#### AI 보완 명세
- 영향 범위: `src/WorkspaceJoinForm.tsx`, `src/types/custom-components.ts`, 신규 `src/WorkspaceJoinFormCustom.tsx`, `src/index.ts`
- 산출물: `src/WorkspaceJoinFormCustom.tsx`, 타입 추가, index export

---

### TASK-005: VerifyEmailFormCustom, ResendVerificationFormCustom + 타입 구현
- **타입**: ADD
- **영역**: FE
- **설명**: VerifyEmailFormCustom, ResendVerificationFormCustom 및 각 CustomComponents 타입 구현.
- **의존성**: TASK-004

#### AI 보완 명세
- 영향 범위: `src/VerifyEmailForm.tsx`, `src/ResendVerificationForm.tsx`, types, 신규 *FormCustom.tsx, index.ts
- 산출물: `src/VerifyEmailFormCustom.tsx`, `src/ResendVerificationFormCustom.tsx`, 타입, export

---

### TASK-006: RequestPasswordResetFormCustom, ResetPasswordFormCustom + 타입 구현
- **타입**: ADD
- **영역**: FE
- **설명**: RequestPasswordResetFormCustom, ResetPasswordFormCustom 및 각 CustomComponents 타입 구현. fullpage/card 레이아웃 및 sent/success 상태 대응.
- **의존성**: TASK-005

#### AI 보완 명세
- 영향 범위: RequestPasswordResetForm, ResetPasswordForm, types, 신규 *FormCustom.tsx, index.ts
- 산출물: `src/RequestPasswordResetFormCustom.tsx`, `src/ResetPasswordFormCustom.tsx`, 타입, export

---

### TASK-007: CallbackPageCustom + 타입 구현 (선택)
- **타입**: ADD
- **영역**: FE
- **설명**: 필요 시 CallbackPageCustom 및 주입 타입 구현. loading/success/error 뷰 슬롯.
- **의존성**: TASK-006

#### AI 보완 명세
- 영향 범위: `src/CallbackPage.tsx`, types, 신규 `src/CallbackPageCustom.tsx`, index.ts
- 산출물: 선택 적용 시 위 파일들

---

### TASK-008: Example 앱 라우트/탭으로 기본·스타일·주입 구분
- **타입**: MODIFY
- **영역**: FE
- **설명**: example에서 세 가지 사용 패턴을 보여주기 위해 라우트 또는 탭 구성. (예: /default, /style, /custom 또는 한 페이지 내 전환)
- **의존성**: TASK-002

#### AI 보완 명세
- 영향 범위: `example/src/App.tsx`, 라우트/탭 구조
- 산출물: `example/src/App.tsx` 수정

---

### TASK-009: Example 기본 + 스타일 커스텀 섹션 추가
- **타입**: ADD
- **영역**: FE
- **설명**: 기본 페이지(기존 유지) + 스타일 커스텀 예시 페이지/섹션 추가. className, cardClassName 등만 적용한 예시.
- **의존성**: TASK-008

#### AI 보완 명세
- 영향 범위: example/src
- 산출물: example 내 스타일 커스텀 라우트/섹션 및 컴포넌트

---

### TASK-010: Example 컴포넌트 주입 커스텀 섹션 추가
- **타입**: ADD
- **영역**: FE
- **설명**: LoginFormCustom(및 가능 시 다른 *FormCustom)에 components 넘기는 예시 페이지/섹션 추가. 자체 Card/Button/Input 등 시연.
- **의존성**: TASK-008, TASK-003

#### AI 보완 명세
- 영향 범위: example/src
- 산출물: example 내 주입 커스텀 라우트/섹션 및 예시 components
