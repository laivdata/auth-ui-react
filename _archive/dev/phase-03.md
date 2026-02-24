# Phase 3: Example 앱 구성

## 목적

example 앱에서 (1) 기본 페이지 구성, (2) 스타일 커스텀 예시, (3) 컴포넌트 주입 커스텀 예시를 라우트 또는 탭으로 구분하고 각각 구현한다.

**Phase 번호**: 3  
**의존성**: Phase 2 (TASK-008은 TASK-002 완료 후 가능)

---

## AI Agent 작업

### 1. Task 실행 순서 확인

TASK-008 → TASK-009, TASK-010. TASK-009와 TASK-010은 TASK-008 완료 후 순서 또는 병렬 가능.

### 2. Task 시작 처리 (필수)

선행 Task 완료 확인 후 `dev-state.md` 갱신. STATE 갱신 후에만 구현 시작.

### 3. Task 완료 처리 (필수)

Impact Note 생성, STATE 갱신.

### 4. Phase 완료 처리 (필수)

Phase 3 모든 Task 완료 후 `PHASE_03_DONE: true` 갱신. Planning 기준 개발 계획 완료.

---

## AI Execution Plan

### 실행 순서

```text
TASK-008 (라우트/탭 구분)
    ↓
TASK-009 (스타일 커스텀 섹션) ──┬── TASK-010 (주입 커스텀 섹션)
                                 (순차 또는 병렬)
```

### 테스트 전략

- example 앱 `yarn dev` 실행 후 세 가지 모드(기본/스타일/주입) 모두 동작 확인.

---

## 작업 항목

### TASK-008: Example 앱 라우트/탭으로 기본·스타일·주입 구분

- **타입**: MODIFY
- **의존성**: TASK-002

#### 작업 내용

- example/src/App.tsx(및 라우트 구조)에서 "기본", "스타일 커스텀", "컴포넌트 주입" 세 가지를 라우트(예: /default, /style, /custom) 또는 탭으로 구분. 기존 기본 페이지 구성은 유지.

#### 산출물

- `example/src/App.tsx` 등

---

### TASK-009: Example 기본 + 스타일 커스텀 섹션 추가

- **타입**: ADD
- **의존성**: TASK-008

#### 작업 내용

- 스타일 커스텀 예시 페이지/섹션 추가. LoginForm·RegisterForm 등에 className, cardClassName, style 등만 적용한 예시 컴포넌트 또는 라우트.

#### 산출물

- example 내 스타일 커스텀용 컴포넌트/라우트

---

### TASK-010: Example 컴포넌트 주입 커스텀 섹션 추가

- **타입**: ADD
- **의존성**: TASK-008, TASK-003

#### 작업 내용

- LoginFormCustom(및 구현된 다른 *FormCustom)에 components prop으로 자체 Card/Button/Input 등을 넘기는 예시 페이지/섹션 추가.

#### 산출물

- example 내 주입 커스텀용 컴포넌트/라우트 및 예시 components

---

## Phase 완료 확인

모든 Task 완료 후 `dev-state.md`에서 `PHASE_03_DONE: true` 갱신. 개발 계획 완료.

---

## 다음 단계

[개발 계획 완료](./dev-readme.md#완료-조건)
