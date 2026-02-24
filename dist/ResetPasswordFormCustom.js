"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordFormCustom = ResetPasswordFormCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, children: children }));
const DefaultCard = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "reset-password-form-custom", children: children }));
const DefaultInput = (props) => (0, jsx_runtime_1.jsx)("input", { ...props });
const DefaultLabel = ({ htmlFor, children }) => ((0, jsx_runtime_1.jsx)("label", { htmlFor: htmlFor, children: children }));
const DefaultButton = (props) => (0, jsx_runtime_1.jsx)("button", { ...props });
const DefaultAlert = ({ children, role }) => ((0, jsx_runtime_1.jsx)("div", { role: role, children: children }));
const DefaultLink = (props) => ((0, jsx_runtime_1.jsx)("a", { ...props }));
/**
 * 비밀번호 재설정 폼 주입용 래퍼. ResetPasswordForm과 동일 로직 + components로 UI만 주입.
 */
function ResetPasswordFormCustom({ config, search, workspaceName, loginHref, successRedirectPath, failureRedirectPath, onSuccess, onFailure, components: componentsProp, }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [code, setCode] = (0, react_1.useState)('');
    const [newPassword, setNewPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [success, setSuccess] = (0, react_1.useState)(false);
    const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
    const searchStr = search ?? (typeof window !== 'undefined' ? window.location.search : '');
    (0, react_1.useEffect)(() => {
        const qs = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
        const params = new URLSearchParams(qs);
        const emailFromUrl = params.get('email');
        const codeFromUrl = params.get('code');
        if (emailFromUrl)
            setEmail(emailFromUrl);
        if (codeFromUrl)
            setCode(codeFromUrl);
    }, [searchStr]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!email.trim() || !code.trim() || !newPassword.trim()) {
            setError('이메일, 인증 코드, 새 비밀번호를 모두 입력하세요.');
            return;
        }
        if (newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX) {
            setError(`비밀번호는 ${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하여야 합니다.`);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    code: code.trim(),
                    newPassword: newPassword.trim(),
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || '비밀번호 재설정 실패');
            onSuccess?.();
            if (successRedirectPath) {
                window.location.href = successRedirectPath;
                return;
            }
            setSuccess(true);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : '비밀번호 재설정 실패';
            onFailure?.(msg);
            if (failureRedirectPath) {
                const url = new URL(failureRedirectPath, typeof window !== 'undefined' ? window.location.origin : '');
                url.searchParams.set('error', msg);
                window.location.href = url.pathname + url.search;
                return;
            }
            setError(msg);
        }
        finally {
            setLoading(false);
        }
    };
    const Container = componentsProp?.Container ?? DefaultContainer;
    const Card = componentsProp?.Card ?? DefaultCard;
    const Input = componentsProp?.Input ?? DefaultInput;
    const Label = componentsProp?.Label ?? DefaultLabel;
    const Button = componentsProp?.Button ?? DefaultButton;
    const Alert = componentsProp?.Alert ?? DefaultAlert;
    const Link = componentsProp?.Link ?? DefaultLink;
    if (success) {
        return ((0, jsx_runtime_1.jsx)(Container, { className: "auth-container", style: {}, children: (0, jsx_runtime_1.jsxs)(Card, { className: "auth-card", style: {}, children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD \uC644\uB8CC" })] }), (0, jsx_runtime_1.jsx)(Alert, { role: "status", children: "\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC0C8 \uBE44\uBC00\uBC88\uD638\uB85C \uB85C\uADF8\uC778\uD558\uC138\uC694." }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: "auth-footer", children: (0, jsx_runtime_1.jsx)(Link, { href: loginHref, "data-testid": "reset-password-login-link", children: "\uB85C\uADF8\uC778\uD558\uAE30" }) }))] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(Container, { className: "auth-container", style: {}, children: (0, jsx_runtime_1.jsxs)(Card, { className: "auth-card", style: {}, children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uC124\uC815" })] }), error && ((0, jsx_runtime_1.jsx)(Alert, { role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: "auth-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "reset-password-email-custom", children: "\uC774\uBA54\uC77C \uC8FC\uC18C" }), (0, jsx_runtime_1.jsx)(Input, { id: "reset-password-email-custom", type: "email", name: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "\uC774\uBA54\uC77C", required: true, "data-testid": "reset-password-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "reset-password-code-custom", children: "\uC778\uC99D \uCF54\uB4DC" }), (0, jsx_runtime_1.jsx)(Input, { id: "reset-password-code-custom", type: "text", name: "code", value: code, onChange: (e) => setCode(e.target.value), placeholder: "\uC774\uBA54\uC77C\uB85C \uBC1B\uC740 \uC778\uC99D \uCF54\uB4DC (6\uC790\uB9AC)", required: true, "data-testid": "reset-password-code", autoComplete: "one-time-code" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "reset-password-new-password-custom", children: "\uC0C8 \uBE44\uBC00\uBC88\uD638" }), (0, jsx_runtime_1.jsx)(Input, { id: "reset-password-new-password-custom", type: "password", name: "newPassword", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: `${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`, required: true, minLength: PASSWORD_MIN, maxLength: PASSWORD_MAX, "data-testid": "reset-password-new-password", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "reset-password-confirm-custom", children: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778" }), (0, jsx_runtime_1.jsx)(Input, { id: "reset-password-confirm-custom", type: "password", name: "confirmPassword", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", required: true, "data-testid": "reset-password-confirm", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsx)(Button, { type: "submit", disabled: loading, "data-testid": "reset-password-submit", children: loading ? '처리 중...' : '비밀번호 재설정' })] }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: "auth-footer", children: (0, jsx_runtime_1.jsx)(Link, { href: loginHref, children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30" }) }))] }) }));
}
