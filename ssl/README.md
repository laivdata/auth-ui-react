# SSL (로컬 HTTPS용)

예제 앱을 HTTPS로 띄울 때 사용하는 인증서 디렉터리입니다.

## 필요한 파일

- `laivdata-key.pem` (개인키)
- `laivdata-cert.pem` (인증서)

## 설정 방법

**agent-auth** 프로젝트의 `ssl/` 폴더에서 위 두 파일을 이 디렉터리로 복사하세요.

```bash
# 예: agent-auth와 auth-ui-react가 형제 디렉터리인 경우
cp /path/to/agent-auth/ssl/laivdata-key.pem /path/to/auth-ui-react/ssl/
cp /path/to/agent-auth/ssl/laivdata-cert.pem /path/to/auth-ui-react/ssl/
```

이후 루트에서 `yarn sample:dev:https` 또는 example에서 `yarn dev:https`로 실행하면  
https://sample-local.laivdata.com:5173 으로 접속할 수 있습니다.
