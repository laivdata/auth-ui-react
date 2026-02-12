# auth-ui-react 샘플 (React)

`@laivdata/auth-ui-react`를 사용하는 샘플 React 앱입니다 (클라이언트 유틸·UI 컴포넌트 모두 동일 패키지).  
로그인, 회원가입, 이메일 인증, OAuth2 콜백, 워크스페이스 가입을 라우트별로 테스트할 수 있습니다.

**이 예제는 루트 워크스페이스에 포함되지 않습니다.**  
예제만 실행할 때는 **이 디렉터리에서만** `yarn` 하면 되며, 루트에서 전체 의존성을 설치할 필요가 없습니다.

### 배포된 샘플 (example deployed page)

- **https://auth-sample.laivdata.com/** — 배포된 예제 앱 확인 가능 주소

## 사전 요구사항

- **인증 서버(agent-auth)가 동작 중** (예: 저장소 루트에서 `yarn start:local` 또는 `yarn start`로 백엔드 실행)

## 실행 (예제만 독립 실행)

**이 디렉터리**에서:

```bash
cd packages/auth-ui-react/example
yarn
yarn dev
```

- `@laivdata/auth-ui-react`는 `file:..` 로 상위 패키지를 참조합니다.
- Vite가 패키지 **소스**를 직접 번들하므로, 패키지를 미리 빌드하지 않아도 됩니다.
- 브라우저에서 http://localhost:5173 이 열립니다.

## 루트에서 스크립트로 실행 (선택)

저장소 루트에서 예제를 띄우고 싶다면:

```bash
# 루트에서 (루트 yarn 불필요)
yarn sample:dev
```

`sample:dev` / `sample:dev:https` / `sample:build` 는 `cd packages/auth-ui-react/example && yarn ...` 로 동작합니다.  
패키지 빌드가 필요할 때만 루트에서 `yarn sample:build-packages` 를 실행하면 됩니다.

### SSL(HTTPS)로 실행

인증 서버와 동일한 로컬 SSL 인증서(`ssl/laivdata-*.pem`)를 사용해 HTTPS로 띄울 수 있습니다.

```bash
# 이 디렉터리에서
yarn dev:https

# 또는 루트에서
yarn sample:dev:https
```

- 접속 URL: **https://sample-local.laivdata.com:5173**
- `sample-local.laivdata.com`이 `/etc/hosts`에 없으면 먼저 등록하세요:
  - `sudo ./scripts/setup-hosts.sh` (기본 도메인에 `sample-local.laivdata.com` 포함)
  - 또는 `DOMAINS="sample-local.laivdata.com" sudo ./scripts/setup-hosts.sh`

## 환경 변수 (선택)

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_AUTH_SERVER_BASE_URL` | 인증 서버 URL | `https://auth-local.laivdata.com:3000` |
| `VITE_APP_BASE_URL` | 앱 기준 URL (OAuth2 콜백·state 처리에 사용) | 브라우저에서는 `window.location.origin`, 그 외 `http://localhost:5173` |

예: 인증 서버가 `http://localhost:3000`인 경우, 샘플이 `http://localhost:5173`에서 돌면 **다른 origin**이므로:

- `.env` 또는 실행 시:
  - `VITE_AUTH_SERVER_BASE_URL=http://localhost:3000`
- 인증 서버 CORS에 `http://localhost:5173` 허용 필요

**OAuth2(Google/Naver/Kakao) 로그인**  
- Google 등에 등록하는 **redirect URI**는 **인증 서버(auth-local) 콜백 URL**입니다 (예: `https://auth-local.laivdata.com:3000/fe/callback`).  
- 예제 앱은 로그인 시 `workspace_id`와 **서비스 콜백 URL**(예: `http://localhost:5173/auth/callback`)을 쿼리로 넘깁니다. 인증 서버는 이 둘을 **state**에 넣고, 자체 콜백에서 로그인 처리 후 해당 서비스 URL로 리다이렉트합니다.  
- `VITE_OAUTH2_WORKSPACE_ID`: 사용할 워크스페이스 ID (기본 `system-workspace`). 해당 워크스페이스의 `allowedDomains`에 예제 앱 **호스트(포트 포함)**가 들어 있어야 합니다. 예: `localhost:5173`, `sample-local.laivdata.com:5173`. 비어 있으면 도메인 검증을 건너뜁니다.

Same subdomain으로 테스트하려면 인증 서버를 5173이 아닌 포트(예: 3000)에서 띄우고, Vite를 3000으로 프록시하거나, `VITE_AUTH_SERVER_BASE_URL=http://localhost:3000`으로 두고 CORS만 허용하면 됩니다.

## 테스트 시나리오

1. **회원가입** (`/register`)에서 이메일/비밀번호/이름 입력 후 가입
2. **로그인** (`/login`)에서 이메일/비밀번호 또는 OAuth2(Google/Naver/Kakao)로 로그인
3. **이메일 인증** (`/verify-email`) — 인증 메일 링크 또는 코드 입력
4. **인증 메일 재전송** (`/resend-verification`)
5. **OAuth2 콜백** (`/auth/callback`) — OAuth2 로그인 후 자동 진입
6. **워크스페이스 가입** (`/workspace-join`) — 로그인된 상태에서 워크스페이스 ID로 가입
7. **비밀번호 재설정 요청** (`/reset-password-request`) — 이메일로 재설정 메일 발송
8. **비밀번호 변경** (`/reset-password`) — 재설정 메일 링크 또는 코드 + 새 비밀번호로 변경

## AWS Amplify 배포

저장소 루트에 `amplify.yml`이 있으면 Amplify가 example 앱을 빌드·배포합니다.

1. Amplify 콘솔에서 앱 연결 시 **Root directory**는 비워두고, 빌드 설정은 `amplify.yml` 사용.
2. **Hosting > Rewrites and redirects**에서 SPA용 리라이트 추가 (필수).  
   **`/<*>` 전부를 index.html로 보내면 `/assets/*.js`, `*.css`까지 HTML이 반환되어 MIME 오류가 납니다.**  
   **정적 파일 확장자(.js, .css 등)는 제외**하고 나머지 경로만 index.html로 보내야 합니다.  
   이 디렉터리의 **`amplify-redirects.json`** 내용을 복사해 콘솔 **Rewrites and redirects > Edit > Open in JSON editor**에 붙여넣고 저장하세요.
3. **환경 변수**(선택): `VITE_AUTH_SERVER_BASE_URL`, `VITE_APP_BASE_URL`, `VITE_OAUTH2_WORKSPACE_ID` — 배포된 URL·인증 서버에 맞게 설정.
