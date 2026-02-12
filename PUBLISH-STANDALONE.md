# auth-ui-react 전용 repo로 푸시하기

이 폴더(packages/auth-ui-react)를 https://github.com/laivdata/auth-ui-react 에 푸시할 때 사용합니다.  
**agent-auth 저장소 루트**에서 실행하세요.

```bash
# 1) 변경 사항 커밋 (amplify.yml, package.json, README 등)
git add packages/auth-ui-react
git commit -m "chore(auth-ui-react): add amplify.yml, point repository to auth-ui-react repo"

# 2) 이 패키지만 루트로 만든 브랜치 생성
git subtree split -P packages/auth-ui-react -b auth-ui-react-standalone

# 3) 새 repo에 main으로 푸시
git push https://github.com/laivdata/auth-ui-react.git auth-ui-react-standalone:main
```

이후 동기화할 때마다 1~3 반복 (커밋 후 split → push).
