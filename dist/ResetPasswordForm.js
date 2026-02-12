"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordForm = ResetPasswordForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;
/**
 * 비밀번호 재설정 폼.
 * URL 쿼리에서 email, code를 읽을 수 있음. 새 비밀번호 입력 후 POST /api/auth/reset-password 호출.
 */
function ResetPasswordForm({ config, search, workspaceName, loginHref, successRedirectPath, failureRedirectPath, layout = 'fullpage', onSuccess, onFailure, }) {
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
    if (success) {
        const successCard = ((0, jsx_runtime_1.jsxs)("div", { className: "auth-card", "data-testid": "reset-password-success", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD \uC644\uB8CC" })] }), (0, jsx_runtime_1.jsx)("div", { className: "alert alert-success", role: "status", children: "\uBE44\uBC00\uBC88\uD638\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC0C8 \uBE44\uBC00\uBC88\uD638\uB85C \uB85C\uADF8\uC778\uD558\uC138\uC694." }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: "auth-footer", children: (0, jsx_runtime_1.jsx)("a", { href: loginHref, "data-testid": "reset-password-login-link", children: "\uB85C\uADF8\uC778\uD558\uAE30" }) }))] }));
        return layout === 'card' ? successCard : (0, jsx_runtime_1.jsx)("div", { className: "auth-container", children: successCard });
    }
    const card = ((0, jsx_runtime_1.jsxs)("div", { className: "auth-card", "data-testid": "reset-password-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uC0C8 \uBE44\uBC00\uBC88\uD638 \uC124\uC815" })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert-danger", role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: "auth-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "reset-password-email", children: "\uC774\uBA54\uC77C \uC8FC\uC18C" }), (0, jsx_runtime_1.jsx)("input", { id: "reset-password-email", type: "email", name: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "reset-password-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "reset-password-code", children: "\uC778\uC99D \uCF54\uB4DC" }), (0, jsx_runtime_1.jsx)("input", { id: "reset-password-code", type: "text", name: "code", placeholder: "\uC774\uBA54\uC77C\uB85C \uBC1B\uC740 \uC778\uC99D \uCF54\uB4DC (6\uC790\uB9AC)", value: code, onChange: (e) => setCode(e.target.value), required: true, "data-testid": "reset-password-code", autoComplete: "one-time-code" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "reset-password-new-password", children: "\uC0C8 \uBE44\uBC00\uBC88\uD638" }), (0, jsx_runtime_1.jsx)("input", { id: "reset-password-new-password", type: "password", name: "newPassword", placeholder: `${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`, value: newPassword, onChange: (e) => setNewPassword(e.target.value), required: true, minLength: PASSWORD_MIN, maxLength: PASSWORD_MAX, "data-testid": "reset-password-new-password", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "reset-password-confirm", children: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778" }), (0, jsx_runtime_1.jsx)("input", { id: "reset-password-confirm", type: "password", name: "confirmPassword", placeholder: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, "data-testid": "reset-password-confirm", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary", disabled: loading, "data-testid": "reset-password-submit", children: loading ? '처리 중...' : '비밀번호 재설정' })] }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: "auth-footer", children: (0, jsx_runtime_1.jsx)("a", { href: loginHref, children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30" }) }))] }));
    return layout === 'card' ? card : (0, jsx_runtime_1.jsx)("div", { className: "auth-container", children: card });
}
