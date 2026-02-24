"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceJoinFormCustom = WorkspaceJoinFormCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "workspace-join-form-custom", children: children }));
const DefaultInput = (props) => (0, jsx_runtime_1.jsx)("input", { ...props });
const DefaultButton = (props) => (0, jsx_runtime_1.jsx)("button", { ...props });
const DefaultAlert = ({ children, role = 'alert' }) => ((0, jsx_runtime_1.jsx)("p", { role: role, children: children }));
/**
 * 워크스페이스 가입 폼 주입용 래퍼. WorkspaceJoinForm과 동일 로직 + components로 UI만 주입.
 */
function WorkspaceJoinFormCustom({ config, workspaceId, onSuccess, components: componentsProp, }) {
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
    const Container = componentsProp?.Container ?? DefaultContainer;
    const Input = componentsProp?.Input ?? DefaultInput;
    const Button = componentsProp?.Button ?? DefaultButton;
    const Alert = componentsProp?.Alert ?? DefaultAlert;
    return ((0, jsx_runtime_1.jsx)(Container, { className: "", style: {}, children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)(Input, { id: "workspace-join-secret-custom", type: "password", name: "secret", value: secret, onChange: (e) => setSecret(e.target.value), placeholder: "\uAC00\uC785 \uBE44\uBC00\uBC88\uD638 (\uD544\uC694\uD55C \uACBD\uC6B0)", "data-testid": "workspace-join-secret" }), error && ((0, jsx_runtime_1.jsx)(Alert, { role: "alert", children: error })), (0, jsx_runtime_1.jsx)(Button, { type: "submit", disabled: loading, "data-testid": "workspace-join-submit", children: loading ? '가입 중...' : '워크스페이스 가입' })] }) }));
}
