# TASK-010 Impact Note

**Task**: Example 컴포넌트 주입 커스텀 섹션 추가  
**완료 일시**: 2025-02-12

## SRS 충족 현황

- FR-14: LoginFormCustom, RegisterFormCustom, RequestPasswordResetFormCustom에 components 넘기는 예시 추가.

## 변경 사항

- **example/src/App.tsx**
  - customLoginComponents: Card(파란 테두리), Button(파란 배경) 주입. Login에서 basePath === '/custom'이면 LoginFormCustom + components 사용.
  - customRegisterComponents: Card(초록 테두리). Register에서 /custom이면 RegisterFormCustom + components 사용.
  - customRequestPasswordResetComponents: Card(주황 테두리). RequestPasswordReset에서 /custom이면 RequestPasswordResetFormCustom + components 사용.
- **example/package.json**: 로컬 개발용으로 "@laivdata/auth-ui-react": "file:.." 사용 (빌드·실행 시 로컬 패키지 반영).
