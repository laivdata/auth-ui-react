"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceJoinForm = WorkspaceJoinForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/**
 * 워크스페이스 가입 폼 (비밀번호가 필요한 경우 secret 입력).
 */
function WorkspaceJoinForm({ config, workspaceId, onSuccess }) {
    const [secret, setSecret] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/auth/workspaces/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, ...(secret ? { secret } : {}) }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || '가입 실패');
            onSuccess?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '가입 실패');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { "data-testid": "workspace-join-form", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "\uAC00\uC785 \uBE44\uBC00\uBC88\uD638 (\uD544\uC694\uD55C \uACBD\uC6B0)", value: secret, onChange: (e) => setSecret(e.target.value), "data-testid": "workspace-join-secret" }), error && (0, jsx_runtime_1.jsx)("p", { role: "alert", children: error }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, "data-testid": "workspace-join-submit", children: loading ? '가입 중...' : '워크스페이스 가입' })] }) }));
}
