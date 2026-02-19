"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoginForm = useLoginForm;
const react_1 = require("react");
const client_1 = require("../client");
/**
 * 로그인 폼 상태·제출·OAuth2 제공자 목록을 담당하는 훅.
 * 주입용 UI(LoginFormCustom 등)에서 디자인 컴포넌트만 주입하고 이 훅으로 로직을 연결할 때 사용.
 */
function useLoginForm({ config, workspaceId, redirectUri, providers: providersProp, onSuccess, }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [oauthProviders, setOauthProviders] = (0, react_1.useState)([]);
    const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
    (0, react_1.useEffect)(() => {
        if (providersProp != null && providersProp.length > 0) {
            setOauthProviders(providersProp.map((p) => ({
                provider: p,
                displayName: p.charAt(0) + p.slice(1).toLowerCase(),
                enabled: true,
                loginUrl: (0, client_1.getOAuth2ProviderRedirectUrl)(config, {
                    provider: p,
                    redirectUri,
                    workspaceId,
                }),
            })));
            return;
        }
        let cancelled = false;
        (0, client_1.getAvailableOAuth2Providers)(config).then((list) => {
            if (!cancelled)
                setOauthProviders(list);
        });
        return () => {
            cancelled = true;
        };
    }, [baseUrl, providersProp, config.authServerBaseUrl, redirectUri, workspaceId]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || '로그인 실패');
            onSuccess?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '로그인 실패');
        }
        finally {
            setLoading(false);
        }
    };
    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        setError,
        handleSubmit,
        oauthProviders,
    };
}
