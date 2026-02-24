# Phase 2: *FormCustom 및 타입 구현

## 목적

RegisterFormCustom, WorkspaceJoinFormCustom, VerifyEmailFormCustom, ResendVerificationFormCustom, RequestPasswordResetFormCustom, ResetPasswordFormCustom(, CallbackPageCustom)을 구현하고, `types/custom-components.ts`에 각 CustomComponents 타입을 추가·export한다.

**Phase 번호**: 2  
**의존성**: Phase 1

---

## AI Agent 작업

### 1. Task 실행 순서 확인

TASK-003 → TASK-004 → TASK-005 → TASK-006 → TASK-007(선택) 순서. TASK-005 내부 두 폼은 병렬 가능, TASK-006 내부 두 폼도 병렬 가능.

### 2. Task 시작 처리 (필수)

선행 Task 완료 확인 후 `dev-state.md` 갱신(현재 Task, 상태 `in_progress`, 시작 시간). STATE 갱신 후에만 구현 시작.

### 3. Task 완료 처리 (필수)

Impact Note 생성, 필요 시 리뷰, `dev-state.md`에서 해당 TASK_XXX_DONE: true 및 진행 기록 갱신.

### 4. Phase 완료 처리 (필수)

Phase 2 모든 Task 완료 후 체크리스트 확인, `PHASE_02_DONE: true`, 현재 Phase/Task를 Phase 3·TASK-008로 갱신. 다음: [phase-03.md](./phase-03.md).

---

## AI Execution Plan

### 실행 순서

```text
TASK-003 (RegisterFormCustom)
    ↓
TASK-004 (WorkspaceJoinFormCustom)
    ↓
TASK-005 (VerifyEmail + ResendVerification Custom)
    ↓
TASK-006 (RequestPasswordReset + ResetPassword Custom)
    ↓
TASK-007 (CallbackPageCustom, 선택)
```

### 테스트 전략

- 각 *FormCustom 추가 시 기존 Form과 동일 로직이 동작하는지 수동 또는 단위 테스트로 검증. 필요 시 *FormCustom.spec.tsx 추가.

### 리스크

| 리스크 | 대응 |
|--------|------|
| 훅 분리 시 Form과 FormCustom 간 로직 불일치 | LoginFormCustom 패턴(훅 공유 또는 인라인 로직 복제) 준수 |

---

## 작업 항목

### TASK-003: RegisterFormCustom + 타입 구현

- **타입**: ADD
- **의존성**: TASK-001, TASK-002

#### 작업 내용

- `src/types/custom-components.ts`에 RegisterFormCustomComponents 및 필요한 Props 타입 추가.
- `src/RegisterFormCustom.tsx` 생성: RegisterForm과 동일 로직(또는 useRegisterForm 훅), UI는 components prop으로 주입. 슬롯: Container, Card, Input, Label, Button, Alert, Link.
- `src/index.ts`에 RegisterFormCustom 및 타입 export 추가.

#### 산출물

- `src/RegisterFormCustom.tsx`, `src/types/custom-components.ts`, `src/index.ts`

---

### TASK-004: WorkspaceJoinFormCustom + 타입 구현

- **타입**: ADD
- **의존성**: TASK-003

#### 작업 내용

- WorkspaceJoinFormCustomComponents 타입 정의, WorkspaceJoinFormCustom.tsx 구현, index export.

#### 산출물

- `src/WorkspaceJoinFormCustom.tsx`, types, index

---

### TASK-005: VerifyEmailFormCustom, ResendVerificationFormCustom + 타입 구현

- **타입**: ADD
- **의존성**: TASK-004

#### 작업 내용

- VerifyEmailFormCustom, ResendVerificationFormCustom 및 각 CustomComponents 타입 구현·export.

#### 산출물

- `src/VerifyEmailFormCustom.tsx`, `src/ResendVerificationFormCustom.tsx`, types, index

---

### TASK-006: RequestPasswordResetFormCustom, ResetPasswordFormCustom + 타입 구현

- **타입**: ADD
- **의존성**: TASK-005

#### 작업 내용

- RequestPasswordResetFormCustom, ResetPasswordFormCustom 및 각 CustomComponents 타입 구현. fullpage/card, sent/success 상태 대응.

#### 산출물

- `src/RequestPasswordResetFormCustom.tsx`, `src/ResetPasswordFormCustom.tsx`, types, index

---

### TASK-007: CallbackPageCustom + 타입 구현 (선택)

- **타입**: ADD
- **의존성**: TASK-006

#### 작업 내용

- 필요 시 CallbackPageCustom 및 loading/success/error 슬롯 타입 구현·export.

#### 산출물

- 선택 시 `src/CallbackPageCustom.tsx`, types, index

---

## Phase 완료 확인

모든 Task 완료 및 STATE에서 PHASE_02_DONE: true 갱신 후 Phase 3으로 진행.

---

## 다음 단계

[Phase 3: Example 앱 구성](./phase-03.md)
