# TASK-008 Impact Note

**Task**: Example 앱 라우트/탭으로 기본·스타일·주입 구분  
**완료 일시**: 2025-02-12

## SRS 충족 현황

- FR-15: 라우트로 "기본 / 스타일 커스텀 / 컴포넌트 주입" 구분 완료.

## 변경 사항

- **example/src/App.tsx**
  - ChoicePage: 버튼 3개 (기본 → /default, 스타일 커스텀 → /style, 컴포넌트 주입 → /custom).
  - Route path="/style" 추가, Layout basePath="/style" 동일 자식 라우트.
  - useBasePath(): /custom, /style, /default 순으로 판별.
  - Layout 헤더 제목: basePath에 따라 "기본" | "스타일 커스텀" | "컴포넌트 주입".
  - isVerifyEmail에 /style/verify-email 추가.
