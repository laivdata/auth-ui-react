# auth-ui-react TODO

## Different 도메인 케이스 지원

현재 패키지는 **Same subdomain**(또는 same site, 쿠키 공유 가능)인 경우에만 동작한다.  
Different 도메인(인증 서버와 앱이 서로 다른 사이트)에서도 사용할 수 있도록 아래 두 가지 방식을 지원하는 기능을 구현해야 한다.

**공통**: 두 방식 모두 OAuth2 콜백으로 **code**를 받은 뒤 **token exchange**를 수행하는 흐름이다.

---

### 1. Storage에 토큰 저장 후 사용

- 콜백에서 token exchange 응답의 **access token**(및 필요 시 refresh token)을 **sessionStorage** 또는 **localStorage**에 저장.
- 이후 인증이 필요한 API 호출 시 **Authorization: Bearer &lt;accessToken&gt;** 헤더로 전달.
- 이미 제공 중인 `TokenStorage` 인터페이스·`createLocalStorageStorage` / `createSessionStorageStorage`(sessionStorage 버전 추가 필요)를 활용.
- CallbackPage(또는 토큰 교환 유틸)가 응답 body의 토큰을 받아 지정된 TokenStorage에 저장하도록 확장.
- API 호출 시 토큰을 붙이는 fetch 래퍼 또는 훅/컨텍스트 제공 검토.

---

### 2. 쿠키 저장 + BE 경유로 인증 서버 접근

- 토큰은 **쿠키**에 저장하되, 앱 도메인이 아닌 **앱의 백엔드(BE)**가 인증 서버와 통신.
- 플로우: 콜백에서 **code**를 앱 BE로 전달 → 앱 BE가 인증 서버에 token exchange 요청 → 인증 서버가 쿠키로 토큰 설정(또는 BE가 받아서 앱 도메인용 쿠키로 설정) → 이후 앱은 자신의 BE만 호출하고, BE가 인증 서버 API를 대신 호출.
- auth-ui-react 측에서는: code를 **앱 BE**로 보내는 콜백 플로우, 또는 앱 BE의 proxy URL을 사용하는 설정/유틸 지원이 필요할 수 있음.

---

### 구현 시 참고

- 두 방식 모두 **code 수신 → token exchange**는 필수.
- 인증 서버가 Different 도메인 시 token exchange 응답에 **body로 accessToken**(및 refreshToken)을 내려주는 API/옵션이 필요할 수 있음(1번 방식). 2번 방식은 BE가 인증 서버와 같은 도메인/쿠키 정책이면 기존 쿠키 방식 유지 가능.
