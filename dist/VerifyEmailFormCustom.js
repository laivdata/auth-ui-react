"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailFormCustom = VerifyEmailFormCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "verify-email-form-custom", children: children }));
const DefaultInput = (props) => (0, jsx_runtime_1.jsx)("input", { ...props });
const DefaultButton = (props) => (0, jsx_runtime_1.jsx)("button", { ...props });
const DefaultAlert = ({ children, role }) => ((0, jsx_runtime_1.jsx)("p", { role: role, children: children }));
const DefaultLink = (props) => ((0, jsx_runtime_1.jsx)("a", { ...props }));
/**
 * 이메일 인증 폼 주입용 래퍼. VerifyEmailForm과 동일 로직 + components로 UI만 주입.
 */
function VerifyEmailFormCustom({ config, search, onSuccess, onFailure, components: componentsProp, }) {
    const [status, setStatus] = (0, react_1.useState)('idle');
    const [message, setMessage] = (0, react_1.useState)(null);
    const [codeInput, setCodeInput] = (0, react_1.useState)('');
    const autoSubmitted = (0, react_1.useRef)(false);
    const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
    const searchStr = search ?? (typeof window !== 'undefined' ? window.location.search : '');
    const params = new URLSearchParams(searchStr.startsWith('?') ? searchStr.slice(1) : searchStr);
    const emailFromUrl = params.get('email') ?? '';
    const codeFromUrl = params.get('code') ?? '';
    const workspaceIdFromUrl = params.get('workspaceId') ?? undefined;
    const codeToVerify = codeFromUrl || codeInput;
    const submitVerify = async () => {
        if (!codeToVerify.trim()) {
            setStatus('error');
            setMessage('인증 코드를 입력하세요.');
            return;
        }
        setStatus('loading');
        setMessage(null);
        try {
            const res = await fetch(`${baseUrl}/api/auth/verify-email-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: codeToVerify.trim(), workspaceId: workspaceIdFromUrl }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || '인증에 실패했습니다.');
            setStatus('success');
            setMessage('이메일 인증이 완료되었습니다.');
            onSuccess?.();
        }
        catch (err) {
            setStatus('error');
            const msg = err instanceof Error ? err.message : '인증에 실패했습니다.';
            setMessage(msg);
            onFailure?.(msg);
        }
    };
    (0, react_1.useEffect)(() => {
        if (codeFromUrl && status === 'idle' && !autoSubmitted.current) {
            autoSubmitted.current = true;
            submitVerify();
        }
    }, []);
    const Container = componentsProp?.Container ?? DefaultContainer;
    const Input = componentsProp?.Input ?? DefaultInput;
    const Button = componentsProp?.Button ?? DefaultButton;
    const Alert = componentsProp?.Alert ?? DefaultAlert;
    const Link = componentsProp?.Link ?? DefaultLink;
    if (status === 'success') {
        return ((0, jsx_runtime_1.jsx)(Container, { className: "", style: {}, children: (0, jsx_runtime_1.jsxs)("div", { "data-testid": "verify-email-success", children: [(0, jsx_runtime_1.jsx)(Alert, { role: "status", children: message }), onSuccess == null && ((0, jsx_runtime_1.jsx)(Link, { href: "/login", "data-testid": "verify-email-login-link", children: "\uB85C\uADF8\uC778\uD558\uAE30" }))] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(Container, { className: "", style: {}, children: [emailFromUrl && (0, jsx_runtime_1.jsxs)("p", { children: ["\uC774\uBA54\uC77C: ", emailFromUrl] }), !codeFromUrl && ((0, jsx_runtime_1.jsx)(Input, { id: "verify-email-code-custom", type: "text", name: "code", value: codeInput, onChange: (e) => setCodeInput(e.target.value), placeholder: "\uC778\uC99D \uCF54\uB4DC 6\uC790\uB9AC", "data-testid": "verify-email-code-input" })), (codeFromUrl || codeInput) && status === 'idle' && !codeFromUrl && ((0, jsx_runtime_1.jsx)(Button, { type: "button", onClick: submitVerify, "data-testid": "verify-email-submit", children: "\uC778\uC99D\uD558\uAE30" })), status === 'loading' && (0, jsx_runtime_1.jsx)("p", { children: "\uC778\uC99D \uCC98\uB9AC \uC911..." }), status === 'error' && message && ((0, jsx_runtime_1.jsx)(Alert, { role: "alert", children: message }))] }));
}
