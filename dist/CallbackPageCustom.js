"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackPageCustom = CallbackPageCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("./client");
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "callback-page-custom", children: children }));
const DefaultLoadingView = () => ((0, jsx_runtime_1.jsx)("span", { "data-testid": "callback-loading", children: "\uB85C\uADF8\uC778 \uCC98\uB9AC \uC911..." }));
const DefaultSuccessView = () => ((0, jsx_runtime_1.jsx)("span", { "data-testid": "callback-success", children: "\uB85C\uADF8\uC778\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }));
const DefaultErrorView = ({ children }) => ((0, jsx_runtime_1.jsx)("p", { role: "alert", "data-testid": "callback-error", children: children }));
/**
 * OAuth2 콜백 페이지 주입용 래퍼. CallbackPage와 동일 로직 + components로 UI만 주입.
 */
function CallbackPageCustom({ config, search, defaultPath = '/', workspaceJoinPath = '/workspace-join', onSuccess, onFailure, components: componentsProp, }) {
    const [status, setStatus] = (0, react_1.useState)('loading');
    const [message, setMessage] = (0, react_1.useState)(null);
    const redirectDoneRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        const searchStr = search ?? (typeof window !== 'undefined' ? window.location.search : '');
        const parsed = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
        const params = new URLSearchParams(parsed);
        const { code, error: errorParam, error_description } = (0, client_1.getCallbackParams)(searchStr.startsWith('?') ? searchStr : `?${searchStr}`);
        const workspaceIdFromQuery = params.get('workspace_id') ?? params.get('workspaceId') ?? params.get('workspace-id') ?? undefined;
        if (errorParam) {
            const errMsg = error_description || errorParam || 'OAuth2 인증 중 오류가 발생했습니다.';
            setStatus('error');
            setMessage(errMsg);
            onFailure?.(errMsg);
            return;
        }
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
                        // ignore
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
    const Container = componentsProp?.Container ?? DefaultContainer;
    const LoadingView = componentsProp?.LoadingView ?? DefaultLoadingView;
    const SuccessView = componentsProp?.SuccessView ?? DefaultSuccessView;
    const ErrorView = componentsProp?.ErrorView ?? DefaultErrorView;
    if (status === 'loading') {
        return ((0, jsx_runtime_1.jsx)(Container, { className: "", style: {}, children: (0, jsx_runtime_1.jsx)(LoadingView, {}) }));
    }
    if (status === 'success') {
        return ((0, jsx_runtime_1.jsx)(Container, { className: "", style: {}, children: (0, jsx_runtime_1.jsx)(SuccessView, {}) }));
    }
    return ((0, jsx_runtime_1.jsx)(Container, { className: "", style: {}, children: (0, jsx_runtime_1.jsx)(ErrorView, { children: message }) }));
}
