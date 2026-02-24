# @laivdata/auth-ui-react

서비스 도메인에서 인증 서버(agent-auth)와 연동할 때 쓰는 **React UI + 클라이언트 유틸** 패키지입니다.  
로그인·회원가입·이메일 인증·OAuth2 콜백·워크스페이스 가입·비밀번호 재설정을 한 패키지에서 제공하며, Same/Different subdomain 모두 대응합니다.

## 설치

**npm** (npm에 배포된 경우):

```bash
yarn add @laivdata/auth-ui-react react
```

**Git** (이 저장소에서 직접 설치):

```bash
yarn add git+https://github.com/laivdata/auth-ui-react.git react
# 또는
npm install git+https://github.com/laivdata/auth-ui-react.git react
```

**peer dependency**: `react` >= 18.0.0

---

## 설정 (AuthClientConfig)

| 필드 | 설명 |
|------|------|
| `authServerBaseUrl` | 인증 서버 기준 URL (trailing slash 제외). 예: `https://auth.example.com` |
| `callbackPath` | OAuth2 콜백 경로. 예: `/auth/callback` |
| `appBaseUrl` | 서비스 앱 기준 URL (Different subdomain 시 필수). 예: `https://app.example.com` |

---

## 사용

설정·유틸·컴포넌트를 모두 이 패키지에서 import 합니다.  
**로그인/인증 UI를 인증 서버 FE와 동일한 Figma 디자인으로 쓰려면 스타일을 import 하세요.**  
UI를 바꾸는 방법은 두 가지입니다. **CSS만 바꾸기**: [스타일 커스터마이징 (CSS 변수)](docs/styling.md)에서 `--auth-*` 변수·className 사용법 참고. **디자인 컴포넌트 주입**: [커스터마이징 (주입 경로)](#커스터마이징)에서 `useLoginForm`·`LoginFormCustom`·계약 타입 사용법 참고.

```tsx
import '@laivdata/auth-ui-react/styles.css';
import {
  getCallbackRedirectUri,
  getCallbackParams,
  getOAuth2ProviderRedirectUrl,
  type AuthClientConfig,
  LoginForm,
  RegisterForm,
  CallbackPage,
  WorkspaceJoinForm,
  VerifyEmailForm,
  ResendVerificationForm,
  RequestPasswordResetForm,
  ResetPasswordForm,
} from '@laivdata/auth-ui-react';

const config: AuthClientConfig = {
  authServerBaseUrl: 'https://auth.example.com',
  callbackPath: '/auth/callback',
  appBaseUrl: 'https://app.example.com',
};

// 로그인 (인증 서버 FE와 동일한 카드·헤더·폼·푸터·소셜 버튼 디자인)
<LoginForm
  config={config}
  workspaceId="system-workspace"
  redirectUri={getCallbackRedirectUri(config)}
  workspaceName="내 서비스"
  registerHref="/register"
  resetPasswordHref="/reset-password-request"
  layout="fullpage"
  onSuccess={() => navigate('/')}
/>

// OAuth2 콜백: code 필수, 토큰 교환 후 workspace select 시도 → 없으면 join 경로로
<CallbackPage
  config={config}
  search={location.search}
  defaultPath="/"
  workspaceJoinPath="/workspace-join"
/>
```

---

## 제공 API

### 클라이언트 유틸

| 이름 | 설명 |
|------|------|
| `getCallbackRedirectUri(config)` | 콜백 전체 URL (토큰 교환 시 redirectUri로 사용) |
| `getCallbackParams(search)` | 쿼리에서 `code`, `state`, `error` 추출 |
| `getOAuth2ProviderRedirectUrl(config, options)` | OAuth2 제공자 리다이렉트 URL (로그인 링크용) |
| `getAvailableOAuth2Providers(config)` | 인증 서버 `GET /api/auth/oauth2/providers` 조회 — 사용 가능한 OAuth2 버튼 목록(displayName, loginUrl 포함). |
| `getOAuth2LoginUrl(config, options)` | POST login-url API로 로그인 URL 조회 (async) |
| `getLoginPageUrl(config)` | 인증 서버 로그인 페이지 URL |
| `createMemoryStorage()` / `createLocalStorageStorage(key)` | 토큰 저장소 (테스트·Different subdomain용) |

### 훅

| 이름 | 용도 |
|------|------|
| **useLoginForm** | 로그인 폼 상태·제출·OAuth2 제공자 목록. 반환: `email`, `setEmail`, `password`, `setPassword`, `loading`, `error`, `setError`, `handleSubmit`, `oauthProviders`. 주입 경로에서 자체 UI와 연결할 때 사용. |

### 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| **LoginForm** | 로컬(이메일/비밀번호) + OAuth2. 인증 서버 FE와 동일한 카드·헤더·폼·푸터·소셜 버튼 구조. `workspaceName`(헤더), `registerHref`, `resetPasswordHref`(푸터 링크), `layout`(`'fullpage'` 또는 `'card'`) 옵션. OAuth2 제공자는 `GET /api/auth/oauth2/providers` 자동 조회. |
| **LoginFormCustom** | 로그인 폼 주입용 래퍼. `useLoginForm` 로직 + `components`(Container, Card, Input, Label, Button, Alert, Link, OAuthButton)로 UI만 주입. 미주입 시 기본 div/input/button 사용. |
| **RegisterForm** | 이메일·비밀번호·표시명 회원가입. |
| **RegisterFormCustom** | 회원가입 폼 주입용. `components`로 Container, Card, Input, Label, Button, Alert, Link 등 UI만 교체. |
| **VerifyEmailForm** | 이메일 인증 (쿼리 `email`, `code` 또는 직접 입력). |
| **VerifyEmailFormCustom** | 이메일 인증 폼 주입용. `components`로 UI만 교체. |
| **ResendVerificationForm** | 인증 메일 재전송. |
| **ResendVerificationFormCustom** | 인증 메일 재전송 폼 주입용. `components`로 UI만 교체. |
| **CallbackPage** | OAuth2 서비스 콜백. **code 필수** → 토큰 교환 → `workspace_id` 있으면 **workspace select** 시도 → 성공 시 홈, 실패 시 **workspace join** 경로로 이동. |
| **CallbackPageCustom** | 콜백 페이지 주입용. 토큰 교환·워크스페이스 선택 로직 + `components`로 화면만 교체. |
| **WorkspaceJoinForm** | 워크스페이스 가입 (workspaceId, secret 등). |
| **WorkspaceJoinFormCustom** | 워크스페이스 가입 폼 주입용. `components`로 UI만 교체. |
| **RequestPasswordResetForm** | 비밀번호 재설정 요청 (이메일 발송). |
| **RequestPasswordResetFormCustom** | 비밀번호 재설정 요청 폼 주입용. `components`로 UI만 교체. |
| **ResetPasswordForm** | 비밀번호 변경 (쿼리 `email`, `code` 또는 입력). |
| **ResetPasswordFormCustom** | 비밀번호 변경 폼 주입용. `components`로 UI만 교체. |

---

## 커스터마이징

### 1. CSS 변수·className (기본 디자인 유지)

- **스타일 시트**: `import '@laivdata/auth-ui-react/styles.css'` 후, [스타일 커스터마이징 (CSS 변수)](docs/styling.md)에서 `--auth-*` 변수 목록·용도·사용 예시 참고.
- **레이아웃 className/style**: `LoginForm`, `RegisterForm` 등은 `AuthFormLayoutProps`를 지원합니다. `containerClassName`, `cardClassName`, `formClassName`, `headerClassName`, `footerClassName` 및 대응 `*Style`로 최상위·카드·폼·헤더·푸터에 클래스/인라인 스타일을 줄 수 있습니다.

### 2. 주입 경로 (디자인 컴포넌트 직접 주입)

자체 디자인 시스템(버튼·입력·카드 등)을 쓰려면 **훅 + 주입 래퍼**를 사용하세요.

- **훅**: `useLoginForm({ config, workspaceId?, redirectUri?, providers?, onSuccess? })` → `{ email, setEmail, password, setPassword, loading, error, setError, handleSubmit, oauthProviders }`.  
  이 값으로 자체 폼을 완전히 그리거나, 아래 래퍼에 컴포넌트만 넘길 수 있습니다.
- **래퍼**: `LoginFormCustom`에 `components?: LoginFormCustomComponents`를 넘기면, 해당 슬롯만 주입된 컴포넌트로 렌더합니다.  
  동일한 방식으로 **RegisterFormCustom**, **WorkspaceJoinFormCustom**, **VerifyEmailFormCustom**, **ResendVerificationFormCustom**, **RequestPasswordResetFormCustom**, **ResetPasswordFormCustom**, **CallbackPageCustom**이 제공되며, 각각 대응하는 `*CustomComponents` 타입으로 슬롯 규격을 정의합니다.  
  **각 슬롯의 규격(필수 prop·용도)은 [주입용 디자인 컴포넌트 규격](docs/custom-components.md)을 참고하세요.**

```tsx
import {
  useLoginForm,
  LoginFormCustom,
  type LoginFormCustomComponents,
  type AuthCardProps,
  type AuthButtonProps,
} from '@laivdata/auth-ui-react';

// 예: 카드·버튼만 주입
const MyCard: React.FC<AuthCardProps> = ({ children, className }) => (
  <div className={className} data-theme="my-app">{children}</div>
);
const MyButton: React.FC<AuthButtonProps> = (props) => <YourButton {...props} />;

<LoginFormCustom
  config={config}
  providers={['GOOGLE']}
  onSuccess={() => navigate('/')}
  components={{ Card: MyCard, Button: MyButton }}
/>
```

---

## 콜백 플로우 (CallbackPage)

1. 인증 서버가 서비스로 리다이렉트할 때 **code**(및 state, workspace_id)를 쿼리에 포함.
2. **code 없음** → 에러 표시 (로그인 페이지에서 다시 시도 유도).
3. **code 있음** → `POST /api/auth/token` 토큰 교환.
4. **user.wsid 있음** → `defaultPath`(예: 홈)로 이동.
5. **user.wsid 없음** + 쿼리에 **workspace_id** 있음 → `POST /api/auth/workspace/select` 시도.  
   - 성공(이미 가입) → 홈으로 이동.  
   - 실패(미가입) → `workspaceJoinPath`(예: `/workspace-join?workspaceId=...`)로 이동.
6. 워크스페이스 가입 완료 후 앱에서 홈 등으로 리다이렉트 처리.

---

## 인증 서버 API 참고

- **GET /api/auth/me**  
  - 로그인 여부·사용자 정보.  
  - 응답에 **`workspaceId`**(현재 선택된 워크스페이스 ID, 없으면 null) 포함.
- **POST /api/auth/workspace/select**  
  - 이미 가입된 워크스페이스 선택 시 사용. 선택된 경우 새 토큰(wsid 포함) 발급.

---

## 예제

- **동작 데모**: [https://auth-ui-sample.laivdata.com/](https://auth-ui-sample.laivdata.com/) — 배포된 예제 앱 (동작만 확인할 때 사용).
- **예제 소스**: 예제 앱은 **npm에 포함되지 않고** 이 저장소의 `example/` 에만 있습니다.  
  로컬에서 실행·수정해 보려면 **저장소를 clone** 한 뒤 아래처럼 실행하면 됩니다.

```bash
# 저장소 루트에서
yarn sample:dev
yarn sample:dev:https   # HTTPS (sample-local.laivdata.com:5173)

# 또는 예제 디렉터리에서
cd example
yarn && yarn dev
```

- **예제 구성**: 루트(`/`)에서 **기본** / **스타일 커스텀** / **컴포넌트 주입** 중 하나를 선택해 들어가면, 동일 폼을 각각 기본 스타일·`className`/`cardClassName`만으로 테마 변경·`components` 주입으로 UI 교체한 화면을 비교할 수 있습니다.
- **라우트**: `/`, `/login`, `/register`, `/verify-email`, `/resend-verification`, `/auth/callback`, `/workspace-join`, `/reset-password-request`, `/reset-password`
- 비로그인: 로그인·회원가입·인증 메일 재전송만 노출. 로그인 시: 비밀번호 재설정 요청·비밀번호 변경 노출. 워크스페이스 가입은 콜백에서만 진입.

---

## 배포 (Publish)

현재 패키지는 `"private": true` 로 올리지 않은 상태입니다.

### npm 공개 배포 (권장)

공개 npm(npmjs.com)에 올리면 **설치 시 토큰·인증 없이** `yarn add @laivdata/auth-ui-react` 로 사용할 수 있습니다.

1. `package.json`에서 `"private": true` 제거 (또는 `false` 로 변경).
2. [npmjs.com](https://www.npmjs.com) 계정으로 `npm login` (최초 1회).
3. 배포:

```bash
yarn build
npm publish --access public
```

- 스코프 패키지(`@laivdata/...`)는 **첫 배포 시** `--access public` 이 필요합니다.
- 배포 후 어디서든 `yarn add @laivdata/auth-ui-react react` 로 설치 가능 (추가 설정 없음).

### 모노레포 / 로컬

- 같은 저장소: `yarn workspaces` 또는 `"@laivdata/auth-ui-react": "file:.."`(예: example에서 상위 패키지 참조) 로 참조.
- 다른 프로젝트: 루트에서 `yarn pack:auth-ui-react` 실행 시 `laivdata-auth-ui-react-<version>.tgz` 가 루트에 생성됩니다.  
  `yarn add ./path/to/laivdata-auth-ui-react-<version>.tgz` 또는 git 의존성으로 설치합니다.

### GitHub Packages (선택)

회사 내부에서만 쓰려면 `publishConfig.registry` 를 `https://npm.pkg.github.com` 로 두고 배포할 수 있습니다.  
단, GitHub Packages는 **설치할 때도** `.npmrc` 인증이 필요합니다. 자세한 절차는 [GitHub Docs – npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) 를 참고하세요.
