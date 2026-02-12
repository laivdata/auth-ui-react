"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterForm = RegisterForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/** 서버 LocalRegisterDto와 동일한 제약 */
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;
const DISPLAY_NAME_MIN = 2;
const DISPLAY_NAME_MAX = 50;
/**
 * 회원가입 폼. 인증 서버 FE와 동일한 비밀번호·표시명 제약 및 비밀번호 확인 검증.
 * 스타일 적용을 위해 '@laivdata/auth-ui-react/styles.css'를 import 하세요.
 */
function RegisterForm({ config, workspaceName, loginHref, resendVerificationHref, verificationBaseUrl, layout = 'fullpage', onSuccess, }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [displayName, setDisplayName] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
    const validate = () => {
        const trimEmail = email.trim();
        const trimDisplayName = displayName.trim();
        if (!trimEmail)
            return '이메일을 입력하세요.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail))
            return '올바른 이메일 형식이 아닙니다.';
        if (trimDisplayName.length < DISPLAY_NAME_MIN)
            return `표시명은 최소 ${DISPLAY_NAME_MIN}자 이상이어야 합니다.`;
        if (trimDisplayName.length > DISPLAY_NAME_MAX)
            return `표시명은 최대 ${DISPLAY_NAME_MAX}자까지 가능합니다.`;
        if (password.length < PASSWORD_MIN)
            return `비밀번호는 최소 ${PASSWORD_MIN}자 이상이어야 합니다.`;
        if (password.length > PASSWORD_MAX)
            return `비밀번호는 최대 ${PASSWORD_MAX}자까지 가능합니다.`;
        if (password !== confirmPassword)
            return '비밀번호가 일치하지 않습니다.';
        return null;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                    displayName: displayName.trim(),
                    ...(verificationBaseUrl && {
                        verificationBaseUrl: verificationBaseUrl.replace(/\/$/, ''),
                    }),
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || '회원가입 실패');
            onSuccess?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '회원가입 실패');
        }
        finally {
            setLoading(false);
        }
    };
    const hasFooterLinks = !!(loginHref || resendVerificationHref);
    const card = ((0, jsx_runtime_1.jsxs)("div", { className: "auth-card", "data-testid": "register-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uD68C\uC6D0\uAC00\uC785" })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert-danger", role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: "auth-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "register-displayName", children: "\uC774\uB984" }), (0, jsx_runtime_1.jsx)("input", { id: "register-displayName", type: "text", name: "displayName", placeholder: "\uC774\uB984", value: displayName, onChange: (e) => setDisplayName(e.target.value), required: true, minLength: DISPLAY_NAME_MIN, maxLength: DISPLAY_NAME_MAX, "data-testid": "register-displayName", autoComplete: "name" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "register-email", children: "\uC774\uBA54\uC77C" }), (0, jsx_runtime_1.jsx)("input", { id: "register-email", type: "email", name: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "register-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "register-password", children: "\uBE44\uBC00\uBC88\uD638" }), (0, jsx_runtime_1.jsx)("input", { id: "register-password", type: "password", name: "password", placeholder: `${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`, value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: PASSWORD_MIN, maxLength: PASSWORD_MAX, "data-testid": "register-password", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "register-confirmPassword", children: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778" }), (0, jsx_runtime_1.jsx)("input", { id: "register-confirmPassword", type: "password", name: "confirmPassword", placeholder: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, "data-testid": "register-confirmPassword", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary", disabled: loading, "data-testid": "register-submit", children: loading ? '가입 중...' : '회원가입' })] }), hasFooterLinks && ((0, jsx_runtime_1.jsxs)("div", { className: "auth-footer", children: [loginHref && ((0, jsx_runtime_1.jsx)("a", { href: loginHref, "data-testid": "register-login-link", children: "\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694?" })), resendVerificationHref && ((0, jsx_runtime_1.jsx)("a", { href: resendVerificationHref, "data-testid": "register-resend-link", children: "\uC774\uBA54\uC77C \uC778\uC99D\uC744 \uC7AC\uC804\uC1A1\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }))] }))] }));
    if (layout === 'card') {
        return card;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "auth-container", children: card }));
}
