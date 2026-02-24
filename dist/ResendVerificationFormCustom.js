"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendVerificationFormCustom = ResendVerificationFormCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "resend-verification-form-custom", children: children }));
const DefaultInput = (props) => (0, jsx_runtime_1.jsx)("input", { ...props });
const DefaultButton = (props) => (0, jsx_runtime_1.jsx)("button", { ...props });
const DefaultAlert = ({ children, role }) => ((0, jsx_runtime_1.jsx)("p", { role: role, children: children }));
/**
 * 인증 메일 재전송 폼 주입용 래퍼. ResendVerificationForm과 동일 로직 + components로 UI만 주입.
 */
function ResendVerificationFormCustom({ config, verificationBaseUrl, onSuccess, components: componentsProp, }) {
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
    const Container = componentsProp?.Container ?? DefaultContainer;
    const Input = componentsProp?.Input ?? DefaultInput;
    const Button = componentsProp?.Button ?? DefaultButton;
    const Alert = componentsProp?.Alert ?? DefaultAlert;
    if (sent) {
        return ((0, jsx_runtime_1.jsx)(Container, { className: "", style: {}, children: (0, jsx_runtime_1.jsx)("div", { "data-testid": "resend-verification-sent", children: (0, jsx_runtime_1.jsx)(Alert, { role: "status", children: "\uC778\uC99D \uBA54\uC77C\uC744 \uB2E4\uC2DC \uBCF4\uB0C8\uC2B5\uB2C8\uB2E4. \uC774\uBA54\uC77C\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694." }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(Container, { className: "", style: {}, children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)(Input, { id: "resend-verification-email-custom", type: "email", name: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "\uC774\uBA54\uC77C", required: true, "data-testid": "resend-verification-email" }), error && ((0, jsx_runtime_1.jsx)(Alert, { role: "alert", children: error })), (0, jsx_runtime_1.jsx)(Button, { type: "submit", disabled: loading, "data-testid": "resend-verification-submit", children: loading ? '전송 중...' : '인증 메일 다시 보내기' })] }) }));
}
