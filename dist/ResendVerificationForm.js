"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendVerificationForm = ResendVerificationForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/**
 * 인증 메일 재전송 폼.
 * POST /api/auth/resend-verification 호출.
 */
function ResendVerificationForm({ config, verificationBaseUrl, onSuccess, className, style, formClassName, formStyle, }) {
    const [email, setEmail] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [sent, setSent] = (0, react_1.useState)(false);
    const baseUrl = config.authServerBaseUrl.replace(/\/$/, '');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    ...(verificationBaseUrl && { verificationBaseUrl: verificationBaseUrl.replace(/\/$/, '') }),
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || '재전송 실패');
            setSent(true);
            onSuccess?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '재전송 실패');
        }
        finally {
            setLoading(false);
        }
    };
    if (sent) {
        return ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "resend-verification-sent", children: (0, jsx_runtime_1.jsx)("p", { role: "status", children: "\uC778\uC99D \uBA54\uC77C\uC744 \uB2E4\uC2DC \uBCF4\uB0C8\uC2B5\uB2C8\uB2E4. \uC774\uBA54\uC77C\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694." }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "resend-verification-form", children: (0, jsx_runtime_1.jsxs)("form", { className: formClassName, style: formStyle, onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "resend-verification-email" }), error && (0, jsx_runtime_1.jsx)("p", { role: "alert", children: error }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, "data-testid": "resend-verification-submit", children: loading ? '전송 중...' : '인증 메일 다시 보내기' })] }) }));
}
