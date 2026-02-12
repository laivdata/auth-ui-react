"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackPage = CallbackPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("./client");
/**
 * OAuth2 콜백 페이지 컴포넌트.
 * 보안상 code는 필수입니다. 인증 서버가 서비스로 리다이렉트할 때 code(및 state)를 쿼리에 포함합니다.
 * - code 있음: POST /api/auth/token으로 토큰 교환 → user.wsid에 따라 defaultPath 또는 workspaceJoinPath로 이동.
 * - code 없음: 에러 표시 (로그인 페이지에서 다시 시도 유도).
 */
function CallbackPage({ config, search, defaultPath = '/', workspaceJoinPath = '/workspace-join', onSuccess, onFailure, }) {
    const [status, setStatus] = (0, react_1.useState)('loading');
    const [message, setMessage] = (0, react_1.useState)(null);
    const redirectDoneRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        const searchStr = search ?? (typeof window !== 'undefined' ? window.location.search : '');
        const parsed = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
        const params = new URLSearchParams(parsed);
        const { code, error: errorParam, error_description } = (0, client_1.getCallbackParams)(searchStr.startsWith('?') ? searchStr : `?${searchStr}`);
        // 인증 서버는 workspace_id, 일부 클라이언트는 workspaceId / workspace-id 사용
        const workspaceIdFromQuery = params.get('workspace_id') ?? params.get('workspaceId') ?? params.get('workspace-id') ?? undefined;
        if (errorParam) {
            const errMsg = error_description || errorParam || 'OAuth2 인증 중 오류가 발생했습니다.';
            setStatus('error');
            setMessage(errMsg);
            onFailure?.(errMsg);
            return;
        }
        // code 필수: 인증 서버가 리다이렉트 시 code(및 state)를 붙여 보내므로, 없으면 유효한 콜백이 아님
        if (!code) {
            setStatus('error');
            setMessage('code가 없습니다. 로그인 페이지에서 다시 시도해주세요.');
            onFailure?.('code가 없습니다.');
            return;
        }
        const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
        const redirectUri = (0, client_1.getCallbackRedirectUri)({
            authServerBaseUrl: config.authServerBaseUrl,
            appBaseUrl: config.appBaseUrl,
            callbackPath: config.callbackPath,
        });
        (async () => {
            if (redirectDoneRef.current)
                return;
            try {
                const res = await fetch(`${baseUrl}/api/auth/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, redirectUri }),
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok)
                    throw new Error(data.message || '토큰 교환에 실패했습니다.');
                if (redirectDoneRef.current)
                    return;
                setStatus('success');
                const user = data.user;
                let hasWorkspace = !!user?.wsid;
                let path = hasWorkspace ? defaultPath : workspaceJoinPath;
                // 워크스페이스가 없고 쿼리에 workspace_id 등이 있으면 select 시도 (이미 가입된 경우 바로 성공)
                // select 응답을 반드시 기다린 뒤 성공 시에만 path를 defaultPath로 바꾸고, 그 다음에만 redirect
                if (!hasWorkspace && workspaceIdFromQuery && typeof window !== 'undefined') {
                    try {
                        const selectRes = await fetch(`${baseUrl}/api/auth/workspace/select`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ workspaceId: workspaceIdFromQuery }),
                            credentials: 'include',
                        });
                        const selectData = await selectRes.json().catch(() => ({}));
                        if (selectRes.ok && selectData?.success !== false) {
                            hasWorkspace = true;
                            path = defaultPath;
                        }
                    }
                    catch {
                        // select 실패 시 path는 그대로 workspaceJoinPath
                    }
                }
                if (redirectDoneRef.current)
                    return;
                if (!hasWorkspace && workspaceIdFromQuery && path && typeof window !== 'undefined') {
                    const joinUrl = path.startsWith('http') ? new URL(path) : new URL(path, window.location.origin);
                    joinUrl.searchParams.set('workspaceId', workspaceIdFromQuery);
                    path = joinUrl.toString();
                }
                const href = typeof window !== 'undefined'
                    ? path.startsWith('http')
                        ? path
                        : `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`
                    : '';
                if (href) {
                    redirectDoneRef.current = true;
                    window.location.href = href;
                    return;
                }
                onSuccess?.();
            }
            catch (err) {
                if (redirectDoneRef.current)
                    return;
                setStatus('error');
                const msg = err instanceof Error ? err.message : '토큰 교환에 실패했습니다.';
                setMessage(msg);
                onFailure?.(msg);
            }
        })();
    }, [config.authServerBaseUrl, config.appBaseUrl, config.callbackPath, defaultPath, workspaceJoinPath, onSuccess, onFailure, search]);
    if (status === 'loading')
        return (0, jsx_runtime_1.jsx)("div", { "data-testid": "callback-loading", children: "\uB85C\uADF8\uC778 \uCC98\uB9AC \uC911..." });
    if (status === 'success')
        return (0, jsx_runtime_1.jsx)("div", { "data-testid": "callback-success", children: "\uB85C\uADF8\uC778\uB418\uC5C8\uC2B5\uB2C8\uB2E4." });
    return ((0, jsx_runtime_1.jsx)("div", { "data-testid": "callback-error", children: (0, jsx_runtime_1.jsx)("p", { role: "alert", children: message }) }));
}
