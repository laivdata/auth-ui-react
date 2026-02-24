# 개발 계획 (Development)

**생성 일자**: 2025-02-12  
**Planning 타임스탬프**: 250212-140000  
**프로젝트**: @laivdata/auth-ui-react

---

## 개요

이 개발 계획은 specforge-planning 프로세스를 통해 생성되었습니다.

**목표**: 스타일 커스텀과 컴포넌트 주입을 분리하고, 모든 인증 폼에 주입 API를 제공하며, example에서 기본/스타일/주입 세 가지 패턴을 시연한다.

---

## 플로우

```yaml
flow:
  - step: phase-01
    next: phase-02
  - step: phase-02
    next: phase-03
  - step: phase-03
    next: DONE
```

---

## Phase 목록

### Phase 1: 스타일 vs 주입 분리 (LoginForm) → [phase-01.md](./phase-01.md)

LoginForm을 스타일 전용으로 되돌리고, 테스트를 정리한다.

**Tasks (2개)**:
- TASK-001: LoginForm에서 components prop 및 주입 분기 제거
- TASK-002: LoginForm 스펙에서 components 주입 테스트 정리

**의존성**: 없음

---

### Phase 2: *FormCustom 및 타입 구현 → [phase-02.md](./phase-02.md)

RegisterFormCustom, WorkspaceJoinFormCustom, VerifyEmailFormCustom, ResendVerificationFormCustom, RequestPasswordResetFormCustom, ResetPasswordFormCustom(, CallbackPageCustom) 구현 및 types/custom-components.ts 확장.

**Tasks (5개)**:
- TASK-003: RegisterFormCustom + 타입 구현
- TASK-004: WorkspaceJoinFormCustom + 타입 구현
- TASK-005: VerifyEmailFormCustom, ResendVerificationFormCustom + 타입 구현
- TASK-006: RequestPasswordResetFormCustom, ResetPasswordFormCustom + 타입 구현
- TASK-007: CallbackPageCustom + 타입 구현 (선택)

**의존성**: Phase 1

---

### Phase 3: Example 앱 구성 → [phase-03.md](./phase-03.md)

example 앱에서 기본 / 스타일 커스텀 / 컴포넌트 주입 세 가지 구성을 라우트 또는 탭으로 구분하고, 각각 예시를 추가한다.

**Tasks (3개)**:
- TASK-008: Example 앱 라우트/탭으로 기본·스타일·주입 구분
- TASK-009: Example 기본 + 스타일 커스텀 섹션 추가
- TASK-010: Example 컴포넌트 주입 커스텀 섹션 추가

**의존성**: Phase 2 (TASK-008은 TASK-002 완료 후 가능)

---

## 전체 Task 통계

- **총 Task 수**: 10개
- **Frontend Tasks**: 10개
- **Backend Tasks**: 0개
- **Common Tasks**: 0개

---

## Task 완료 시 필수 작업 (요약)

| 순서 | 작업 | 필수 여부 |
|------|------|----------|
| 1 | **Impact Note 생성** - Task 완료 직후 `dev/impact-notes/`에 작성 | 필수 |
| 2 | **단위 테스트 작성/실행** - 테스트가 필요한 Task인 경우 | 필수 |
| 3 | **STATE 갱신** - `dev-state.md`에서 Task signal `true`로 변경 | 필수 |

---

## 완료 조건

- Phase 1 완료
- Phase 2 완료
- Phase 3 완료
- SRS 갱신 완료 (Impact Notes 기반, 필요 시)
- 실제 상태는 STATE(`dev-state.md`)의 Signals로 관리

---

## 참고 문서

- [SRS 문서](docs/planning/srs.md)
- [Reference (TODOS snapshot)](docs/reference/250212-140000-TODOS.md)
