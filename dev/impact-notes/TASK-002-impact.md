# TASK-002 Impact Note

**Task**: LoginForm 스펙에서 components 주입 테스트 정리  
**완료 일시**: 2025-02-12

## SRS 충족 현황

- FR-2: LoginForm 스펙에서 "custom components when components prop is provided" 테스트 제거. 커스텀 컴포넌트 검증은 LoginFormCustom 스펙에서만 유지.

## 변경 사항

- `src/LoginForm.spec.tsx`:
  - "should render with custom components when components prop is provided" 테스트 제거.
  - LoginForm 테스트 4개 유지: 이메일/비밀번호/제출, OAuth2 버튼, cardClassName, containerClassName.

## 테스트

- `yarn test src/LoginForm.spec.tsx src/LoginFormCustom.spec.tsx`: 7개 전체 통과.
