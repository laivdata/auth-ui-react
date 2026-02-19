# 스타일 커스터마이징 (CSS 변수)

`@laivdata/auth-ui-react/styles.css`를 import한 뒤, 앱에서 **CSS 변수**를 오버라이드하면 색상·간격·타이포 등을 브랜드에 맞게 바꿀 수 있습니다.  
변수는 `:root` 또는 폼/카드를 감싼 **상위 요소**에 정의하면 해당 범위에 적용됩니다.

---

## 변수 목록

### 기본 색상 (Figma 디자인 기반)

| 변수명 | 기본값 | 용도 |
|--------|--------|------|
| `--auth-primary` | `#225695` | 기본 버튼 배경색 |
| `--auth-primary-hover` | `#5198DD` | 버튼 hover 배경색 |
| `--auth-primary-pressed` | `#1A406F` | 버튼 pressed 배경색 |
| `--auth-primary-foreground` | `#ffffff` | 버튼 텍스트 색상 |
| `--auth-primary-disabled-bg` | `#E0E0E0` | 버튼 disabled 배경색 |
| `--auth-primary-disabled-text` | `#888888` | 버튼 disabled 텍스트 색상 |
| `--auth-foreground` | `#000000` | 주요 텍스트 색상 |
| `--auth-muted-foreground` | `#737373` | 보조 텍스트·링크 색상 |
| `--auth-border` | `#e5e5e5` | 입력 필드 테두리 등 |
| `--auth-popover` | `white` | 입력 필드 배경 |
| `--auth-bg-white` | `#ffffff` | 카드·UI 영역 배경색 |
| `--auth-divider` | `#d9d9d9` | 구분선 색상 |
| `--auth-focus-outline` | `#b8d9f2` | 포커스 링(아웃라인) 색상 |

### 모서리·간격

| 변수명 | 기본값 | 용도 |
|--------|--------|------|
| `--auth-rounded-lg` | `8px` | 버튼·입력 필드 border-radius |
| `--auth-rounded-xl` | `16px` | 카드 border-radius |
| `--auth-card-padding` | `40px` | 카드 내부 패딩 (모바일에서는 576px 미만 시 24px로 별도 적용) |

### 버튼

| 변수명 | 기본값 | 용도 |
|--------|--------|------|
| `--auth-btn-height` | `48px` | 버튼 높이 |
| `--auth-btn-font-size` | `16px` | 버튼 글자 크기 |
| `--auth-btn-line-height` | `24px` | 버튼 줄 높이 |
| `--auth-btn-padding` | `16px 24px` | 버튼 패딩 |

### 입력 필드

| 변수명 | 기본값 | 용도 |
|--------|--------|------|
| `--auth-input-height` | `40px` | 입력 필드 높이 |

### 소셜 로그인 버튼 색상

| 변수명 | 기본값 | 용도 |
|--------|--------|------|
| `--naver-bg` | `#03a94d` | 네이버 버튼 배경 |
| `--naver-text` | `white` | 네이버 버튼 텍스트 |
| `--kakao-bg` | `#fee500` | 카카오 버튼 배경 |
| `--kakao-text` | `#000000` | 카카오 버튼 텍스트 |
| `--google-bg` | `#f2f2f2` | 구글 버튼 배경 |
| `--google-text` | `#1f1f1f` | 구글 버튼 텍스트 |
| `--apple-bg` | `#000000` | 애플 버튼 배경 |
| `--apple-text` | `white` | 애플 버튼 텍스트 |

---

## 사용 예시

앱 진입점(예: `index.css` 또는 루트 레이아웃)에서 `:root`로 덮어쓰기:

```css
@import '@laivdata/auth-ui-react/styles.css';

:root {
  --auth-primary: #0d9488;
  --auth-primary-hover: #14b8a6;
  --auth-muted-foreground: #64748b;
  --auth-rounded-xl: 12px;
}
```

특정 페이지만 다르게 쓰려면, 해당 페이지를 감싼 wrapper에만 변수를 정의하면 됩니다.

```css
.my-auth-page {
  --auth-primary: #7c3aed;
  --auth-primary-hover: #8b5cf6;
}
```

```tsx
<div className="my-auth-page">
  <LoginForm config={config} ... />
</div>
```

---

## 참고

- 폰트는 스타일 시트에서 **Pretendard**를 사용합니다. 앱에서 다른 폰트를 쓰려면 상위에서 `font-family`를 오버라이드하거나, 추후 `--auth-font-family` 등 변수가 추가되면 해당 변수를 설정하면 됩니다.
- 카드 패딩·헤더 여백 등은 현재 CSS에서 고정값(예: `40px`, `32px`)을 쓰고 있습니다. 더 세밀한 테마 제어가 필요하면 이 문서와 `src/styles/auth-ui.css`를 참고해 변수를 추가할 수 있습니다.
