# Planning 진행 상태

## Signals

```yaml
signals:
  STEP_1_DONE: true
  STEP_2_DONE: false
  STEP_3_DONE: true
  STEP_4_DONE: true

anchor:
  goal: "스타일 커스텀과 컴포넌트 주입 분리, 모든 인증 폼에 주입 API 제공, example에서 기본/스타일/주입 세 가지 패턴 시연"
  contribution: "Step 4: dev/ 폴더 및 Phase 문서 생성 완료. 개발 진행은 dev/dev-readme.md·dev-state.md·phase-*.md 참조."
```

## 작업 데이터

| 항목 | 값 |
|------|-----|
| 요구사항 요약 | 스타일 전용 Form vs *FormCustom 주입 분리, 6+ 폼 Custom 추가, example 3모드 구성 |
| 영향 범위 | src/ (LoginForm, *FormCustom, types), example/src/App.tsx, docs |
| 예상 Phase 수 | 3 |

## Reference 문서

SRS 작성 시 첨부하는 추가 파일들은 `docs/reference/` 폴더에 timestamp prefix로 복사하여 사용합니다.

**참조 파일 목록**:
- `docs/reference/250212-140000-TODOS.md` (원본: `TODOS.md`)

---

## Task 목록

**Task 파일**: `_work/planning/tasks.md` (생성됨)
