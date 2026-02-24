# Phase 1: 스타일 vs 주입 분리 (LoginForm)

## 목적

LoginForm을 스타일 전용 컴포넌트로 되돌리고, 컴포넌트 주입 검증은 LoginFormCustom 스펙에서만 수행하도록 정리한다.

**Phase 번호**: 1  
**의존성**: 없음

---

## AI Agent 작업

### 1. Task 실행 순서 확인

TASK-001 → TASK-002 순서로 실행한다.

### 2. Task 시작 처리 (필수)

Task를 시작하기 전에:

1. 선행 Task 완료 확인: `dev-state.md`의 Signals에서 선행 Task가 모두 `DONE: true`인지 확인.
2. STATE 갱신: `dev-state.md`에서 "현재 Task"를 해당 Task ID로, 해당 Task 진행 기록 상태를 `in_progress`로, 시작 시간·마지막 갱신을 기록.

STATE 갱신 후에만 Task 작업을 시작한다.

### 3. Task 구현

각 Task를 순서대로 구현하고, 테스트가 필요한 경우 단위 테스트를 작성·실행한다.

### 4. Task 완료 처리 (필수)

Task 완료 시:

1. Impact Note 생성: `dev/impact-notes/TASK-XXX-impact.md`
2. (선택) AI-assisted 리뷰: `dev/reviews/TASK-XXX-review.md`
3. STATE 갱신: `dev-state.md`에서 해당 `TASK_XXX_DONE: true`, 진행 기록 상태 `completed`, 완료 시간·완료된 Task 수·현재 Task·마지막 갱신 갱신.

STATE 미갱신 시 다음 Task 진행 불가.

### 5. Phase 완료 처리 (필수)

Phase 1의 모든 Task가 완료되면:

1. Phase 완료 체크: 모든 Task 완료, 필요 시 단위 테스트 통과, Impact Note 존재 확인.
2. STATE 갱신: `dev-state.md`에서 `PHASE_01_DONE: true`, "현재 Phase"를 Phase 2로, "현재 Task"를 TASK-003으로, 마지막 갱신 갱신.
3. 다음 Phase: [phase-02.md](./phase-02.md) 진행.

---

## AI Execution Plan

### 실행 순서

```text
TASK-001 (LoginForm 분기 제거)
    ↓
TASK-002 (스펙 정리)
```

### 테스트 전략

- TASK-001 완료 후: `yarn test src/LoginForm.spec.tsx` 4개 통과 확인.
- TASK-002 완료 후: `yarn test src/LoginForm.spec.tsx src/LoginFormCustom.spec.tsx` 통과 확인.

### 리스크

| 리스크 | 대응 |
|--------|------|
| 기존 사용자가 LoginForm에 components 넘기던 경우 | 호환 제거가 목적이므로 마이그레이션 가이드(LoginFormCustom 사용)는 README/docs에 명시 가능 |

---

## 작업 항목

### TASK-001: LoginForm에서 components prop 및 주입 분기 제거

- **타입**: MODIFY
- **영역**: FE
- **의존성**: 없음

#### 작업 내용

- `src/LoginForm.tsx`에서 `components` prop, `LoginFormCustomComponents` import, DefaultContainer·DefaultCard·DefaultInput·DefaultLabel·DefaultButton·DefaultAlert·DefaultLink·DefaultOAuthButton, `if (componentsProp) { ... }` 분기 전체 제거. className/style 계열과 기존 카드/폼 마크업만 유지.

#### 산출물

- `src/LoginForm.tsx`

#### Task 완료 처리

완료 직후: Impact Note 생성, STATE 갱신(`TASK_001_DONE: true`).

---

### TASK-002: LoginForm 스펙에서 components 주입 테스트 정리

- **타입**: MODIFY
- **영역**: FE
- **의존성**: TASK-001

#### 작업 내용

- `src/LoginForm.spec.tsx`에서 "should render with custom components when components prop is provided" 테스트 제거. 커스텀 컴포넌트 검증은 LoginFormCustom.spec.tsx에만 두는지 확인.

#### 산출물

- `src/LoginForm.spec.tsx`

#### Task 완료 처리

완료 직후: Impact Note 생성, STATE 갱신(`TASK_002_DONE: true`).

---

## Phase 완료 확인

Phase 1 완료 전: 모든 Task 완료, 단위 테스트 통과, Impact Note 존재 확인 후 `dev-state.md`에서 `PHASE_01_DONE: true` 갱신.

---

## 다음 단계

[Phase 2: *FormCustom 및 타입 구현](./phase-02.md)
