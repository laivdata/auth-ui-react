import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import '@laivdata/auth-ui-react/styles.css';
import {
  getCallbackRedirectUri,
  getAuthServerLoginUrl,
  type AuthClientConfig,
  LoginForm,
  RegisterForm,
  WorkspaceJoinForm,
  VerifyEmailForm,
  ResendVerificationForm,
  CallbackPage,
  RequestPasswordResetForm,
  ResetPasswordForm,
} from '@laivdata/auth-ui-react';
import './App.css';

const authServerBaseUrl =
  import.meta.env.VITE_AUTH_SERVER_BASE_URL ||
  'https://auth-local.laivdata.com:3000';

const appOrigin =
  import.meta.env.VITE_APP_BASE_URL ||
  (typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:5173');

const config: AuthClientConfig = {
  authServerBaseUrl: authServerBaseUrl.replace(/\/$/, ''),
  callbackPath: '/auth/callback',
  appBaseUrl: appOrigin.replace(/\/$/, ''),
};

/** OAuth2 state용: 워크스페이스 ID (인증 서버에 등록된 값, allowedDomains에 예제 앱 도메인 포함 필요) */
const oauth2WorkspaceId = import.meta.env.VITE_OAUTH2_WORKSPACE_ID || 'unknown';

/** GET /api/auth/me로 로그인 여부·연결 계정 타입 조회 (credentials: include) */
function useAuthMe() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id?: string;
    displayName?: string;
    email?: string;
    wsid?: string;
  } | null>(null);
  const [accountTypes, setAccountTypes] = useState<string[]>([]);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const base = config.authServerBaseUrl.replace(/\/$/, '');
      const res = await fetch(`${base}/api/auth/me?silent=true`, {
        credentials: 'include',
      });
      const data = await res.json();
      setAuthenticated(!!(data.authenticated && data.user));
      setUser(data.user ?? null);
      setAccountTypes(
        Array.isArray(data.accountTypes) ? data.accountTypes : [],
      );
    } catch {
      setAuthenticated(false);
      setUser(null);
      setAccountTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const hasLocalAccount =
    accountTypes.includes('local') ||
    (user as { authMethods?: { local?: boolean } } | null)?.authMethods
      ?.local === true;
  return {
    loading,
    authenticated,
    user,
    accountTypes,
    hasLocalAccount,
    refetch: fetchMe,
  };
}

/** 로그인 상태에 따라 링크 또는 비활성 스팬 렌더 */
function NavItem({
  to,
  label,
  current,
  disabled,
}: {
  to: string;
  label: string;
  current: boolean;
  disabled: boolean;
}) {
  const baseClass = current ? 'active' : '';
  const disabledClass = disabled ? 'disabled' : '';
  if (disabled) {
    return (
      <span
        className={`sample-nav-item ${baseClass} ${disabledClass}`}
        aria-disabled="true"
      >
        {label}
      </span>
    );
  }
  return (
    <Link to={to} className={`sample-nav-item ${baseClass}`}>
      {label}
    </Link>
  );
}

/** basePath: '/default' | '/custom' — 네비 링크와 리다이렉트 기준 */
function Layout({ basePath }: { basePath: string }) {
  const path = useLocation().pathname;
  const isCallback = path === '/auth/callback';
  const isVerifyEmail = path === '/verify-email' || path === '/default/verify-email' || path === '/custom/verify-email';
  const isResetPassword = path === '/reset-password';
  const hideNav = isCallback || isVerifyEmail || isResetPassword;
  const { authenticated, hasLocalAccount, refetch } = useAuthMe();
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    if (!hideNav) refetch();
  }, [path, hideNav, refetch]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const base = config.authServerBaseUrl.replace(/\/$/, '');
      const res = await fetch(`${base}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        await refetch();
        window.location.href = basePath;
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="sample">
      {!hideNav && (
        <header className="sample-header">
          <h1>auth-ui-react 샘플 · {basePath === '/custom' ? 'Custom UI' : 'Default'}</h1>
          <p className="sample-auth-url">
            인증 서버: {config.authServerBaseUrl}
          </p>
          <nav className="sample-nav" aria-label="메인">
            <NavItem to={basePath} label="홈" current={path === basePath} disabled={false} />
            {!authenticated && (
              <>
                <NavItem to={`${basePath}/login`} label="로그인" current={path === `${basePath}/login`} disabled={false} />
                <NavItem to={`${basePath}/register`} label="회원가입" current={path === `${basePath}/register`} disabled={false} />
                <NavItem to={`${basePath}/resend-verification`} label="인증 메일 재전송" current={path === `${basePath}/resend-verification`} disabled={false} />
              </>
            )}
            {authenticated && (
              <>
                {hasLocalAccount && (
                  <NavItem to={`${basePath}/reset-password-request`} label="비밀번호 재설정 요청" current={path === `${basePath}/reset-password-request`} disabled={false} />
                )}
                <button
                  type="button"
                  className="sample-nav-item sample-nav-logout"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  data-testid="logout-btn"
                >
                  {logoutLoading ? '로그아웃 중...' : '로그아웃'}
                </button>
              </>
            )}
          </nav>
        </header>
      )}
      <main className="sample-main">
        <Outlet />
      </main>
    </div>
  );
}

/** 최상단: Default / Custom 중 선택 */
function ChoicePage() {
  const navigate = useNavigate();
  return (
    <div className="sample-choice">
      <h1 className="sample-choice-title">auth-ui-react 예제</h1>
      <p className="sample-choice-desc">아래에서 사용할 UI 방식을 선택하세요.</p>
      <div className="sample-choice-buttons">
        <button
          type="button"
          className="sample-choice-btn"
          onClick={() => navigate('/default')}
          data-testid="choice-default"
        >
          <span className="sample-choice-btn-label">Default</span>
          <span className="sample-choice-btn-desc">
            기본 스타일 폼을 그대로 사용합니다. CSS 변수(:root의 --auth-*)만 오버라이드해 색·간격을 바꿀 수 있습니다.
          </span>
        </button>
        <button
          type="button"
          className="sample-choice-btn"
          onClick={() => navigate('/custom')}
          data-testid="choice-custom"
        >
          <span className="sample-choice-btn-label">Custom</span>
          <span className="sample-choice-btn-desc">
            나중에 주입용 컴포넌트(훅·래퍼)를 사용하는 경로입니다. 현재는 Default와 동일한 폼을 표시합니다.
          </span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChoicePage />} />
      <Route path="/default" element={<Layout basePath="/default" />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="resend-verification" element={<ResendVerification />} />
        <Route path="workspace-join" element={<WorkspaceJoin />} />
        <Route path="reset-password-request" element={<RequestPasswordReset />} />
      </Route>
      <Route path="/custom" element={<Layout basePath="/custom" />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="resend-verification" element={<ResendVerification />} />
        <Route path="workspace-join" element={<WorkspaceJoin />} />
        <Route path="reset-password-request" element={<RequestPasswordReset />} />
      </Route>
      <Route path="/auth/callback" element={<Callback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

function Home() {
  return (
    <section className="sample-section">
      <h2>홈</h2>
      <p>
        비로그인 시: 로그인, 회원가입, 인증 메일 재전송만 표시됩니다. 로그인 후
        OAuth2 콜백에서 워크스페이스 미가입이면 워크스페이스 가입 페이지로
        이동하며, 가입 후 홈으로 돌아옵니다. 로그인 상태에서는 비밀번호 재설정
        요청·비밀번호 변경을 사용할 수 있습니다.
      </p>
    </section>
  );
}

function useBasePath(): string {
  const path = useLocation().pathname;
  return path.startsWith('/custom') ? '/custom' : '/default';
}

function Login() {
  const basePath = useBasePath();
  const authServerLoginUrl = getAuthServerLoginUrl(config, {
    workspaceId: oauth2WorkspaceId,
    redirectUri: getCallbackRedirectUri(config),
    responseType: 'code',
  });

  return (
    <section className="sample-section sample-section--auth">
      <div
        className="sample-auth-server-login"
        style={{ marginBottom: '1rem' }}
      >
        <a
          href={authServerLoginUrl}
          className="btn btn-outline-primary"
          style={{ display: 'inline-block' }}
        >
          인증서버 로그인
        </a>
        <p className="small text-muted mt-1 mb-0">
          인증 서버 /fe/login 으로 이동 (client_id, redirect_uri,
          response_type=code 전달)
        </p>
      </div>
      <LoginForm
        config={config}
        workspaceId={oauth2WorkspaceId}
        redirectUri={getCallbackRedirectUri(config)}
        workspaceName="auth-ui-react 샘플"
        registerHref={`${basePath}/register`}
        resetPasswordHref={`${basePath}/reset-password-request`}
        layout="card"
        onSuccess={() => {
          console.log('[auth-ui-react sample]', 'success', '로그인 성공');
          window.location.href = basePath;
        }}
      />
    </section>
  );
}

function Register() {
  const basePath = useBasePath();
  return (
    <section className="sample-section sample-section--auth">
      <RegisterForm
        config={config}
        workspaceName="auth-ui-react 샘플"
        loginHref={`${basePath}/login`}
        resendVerificationHref={`${basePath}/resend-verification`}
        layout="card"
        onSuccess={() => {
          console.log(
            '[auth-ui-react sample]',
            'success',
            '회원가입 성공. 이메일 인증 링크를 확인하세요.',
          );
          window.location.href = `${basePath}/login`;
        }}
      />
    </section>
  );
}

function VerifyEmail() {
  const location = useLocation();
  const basePath = useBasePath();
  return (
    <section className="sample-section">
      <h2>이메일 인증</h2>
      <p className="sample-hint">
        인증 메일 링크로 접속하면 code가 자동으로 전달됩니다. 없으면 코드를
        입력하세요.
      </p>
      <VerifyEmailForm
        config={config}
        search={location.search}
        onSuccess={() => {
          console.log(
            '[auth-ui-react sample]',
            'success',
            '이메일 인증이 완료되었습니다.',
          );
          window.location.href = `${basePath}/login`;
        }}
        onFailure={(msg: string) => {
          console.log('[auth-ui-react sample]', 'failure', msg);
        }}
      />
    </section>
  );
}

function ResendVerification() {
  return (
    <section className="sample-section">
      <h2>인증 메일 재전송</h2>
      <ResendVerificationForm
        config={config}
        onSuccess={() => {
          console.log(
            '[auth-ui-react sample]',
            'success',
            '인증 메일을 재전송했습니다.',
          );
        }}
      />
    </section>
  );
}

function Callback() {
  const location = useLocation();
  return (
    <section className="sample-section">
      <CallbackPage
        config={config}
        search={location.search}
        onSuccess={(redirectUri?: string) => {
          if (!redirectUri) window.location.href = '/default';
        }}
      />
    </section>
  );
}

function WorkspaceJoin() {
  const location = useLocation();
  const basePath = useBasePath();
  const fromQuery =
    new URLSearchParams(location.search).get('workspaceId') ?? '';
  const [workspaceId, setWorkspaceId] = useState(fromQuery || 'my-workspace');
  return (
    <section className="sample-section">
      <h2>워크스페이스 가입</h2>
      <p className="sample-hint">
        로그인된 상태에서 워크스페이스 ID로 가입합니다. 콜백에서 넘어온 경우
        자동으로 채워집니다.
      </p>
      <div className="sample-workspace-id">
        <label htmlFor="workspace-id">워크스페이스 ID</label>
        <input
          id="workspace-id"
          type="text"
          placeholder="예: my-workspace"
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
        />
      </div>
      {workspaceId.trim() ? (
        <WorkspaceJoinForm
          config={config}
          workspaceId={workspaceId.trim()}
          onSuccess={() => {
            console.log(
              '[auth-ui-react sample]',
              'success',
              '워크스페이스에 가입되었습니다.',
            );
            window.location.href = basePath;
          }}
        />
      ) : (
        <p className="sample-muted">위에 워크스페이스 ID를 입력하세요.</p>
      )}
    </section>
  );
}

function RequestPasswordReset() {
  const basePath = useBasePath();
  return (
    <section className="sample-section sample-section--auth">
      <RequestPasswordResetForm
        config={config}
        resetPasswordBaseUrl={`${appOrigin.replace(/\/$/, '')}/reset-password`}
        workspaceName="auth-ui-react 샘플"
        loginHref={`${basePath}/login`}
        layout="card"
        onSuccess={() => {
          console.log(
            '[auth-ui-react sample]',
            'success',
            '비밀번호 재설정 메일을 발송했습니다.',
          );
        }}
      />
    </section>
  );
}

/** 이메일 링크로 진입 (nav 없이 fullpage). 성공 시 /default로 이동 */
function ResetPassword() {
  const location = useLocation();
  return (
    <ResetPasswordForm
      config={config}
      search={location.search}
      workspaceName="auth-ui-react 샘플"
      loginHref="/default/login"
      successRedirectPath="/default"
      layout="fullpage"
      onSuccess={() => {
        console.log(
          '[auth-ui-react sample]',
          'success',
          '비밀번호가 변경되었습니다.',
        );
      }}
      onFailure={(msg: string) => {
        console.log('[auth-ui-react sample]', 'failure', msg);
      }}
    />
  );
}
