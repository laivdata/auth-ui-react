"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordResetFormCustom = RequestPasswordResetFormCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, children: children }));
const DefaultCard = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "request-password-reset-form-custom", children: children }));
const DefaultInput = (props) => (0, jsx_runtime_1.jsx)("input", { ...props });
const DefaultLabel = ({ htmlFor, children }) => ((0, jsx_runtime_1.jsx)("label", { htmlFor: htmlFor, children: children }));
const DefaultButton = (props) => (0, jsx_runtime_1.jsx)("button", { ...props });
const DefaultAlert = ({ children, role }) => ((0, jsx_runtime_1.jsx)("div", { role: role, children: children }));
const DefaultLink = (props) => ((0, jsx_runtime_1.jsx)("a", { ...props }));
/**
 * 비밀번호 재설정 요청 폼 주입용 래퍼. RequestPasswordResetForm과 동일 로직 + components로 UI만 주입.
 */
function RequestPasswordResetFormCustom({ config, context, resetPasswordBaseUrl, workspaceName, loginHref, onSuccess, components: componentsProp, }) {
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
            const res = await fetch(`${baseUrl}/api/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    ...(context && { context }),
                    ...(resetPasswordBaseUrl && { resetPasswordBaseUrl }),
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || '요청 실패');
            setSent(true);
            onSuccess?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '요청 실패');
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
    if (sent) {
        return ((0, jsx_runtime_1.jsx)(Container, { className: "auth-container", style: {}, children: (0, jsx_runtime_1.jsxs)(Card, { className: "auth-card", style: {}, children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uC774\uBA54\uC77C \uBC1C\uC1A1 \uC644\uB8CC" })] }), (0, jsx_runtime_1.jsx)(Alert, { role: "status", children: "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815 \uBA54\uC77C\uC744 \uBCF4\uB0C8\uC2B5\uB2C8\uB2E4. \uC774\uBA54\uC77C\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694." }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: "auth-footer", children: (0, jsx_runtime_1.jsx)(Link, { href: loginHref, children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30" }) }))] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(Container, { className: "auth-container", style: {}, children: (0, jsx_runtime_1.jsxs)(Card, { className: "auth-card", style: {}, children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815" })] }), error && ((0, jsx_runtime_1.jsx)(Alert, { role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: "auth-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "request-password-reset-email-custom", children: "\uC774\uBA54\uC77C \uC8FC\uC18C" }), (0, jsx_runtime_1.jsx)(Input, { id: "request-password-reset-email-custom", type: "email", name: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "\uC774\uBA54\uC77C", required: true, "data-testid": "request-password-reset-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsx)(Button, { type: "submit", disabled: loading, "data-testid": "request-password-reset-submit", children: loading ? '전송 중...' : '재설정 링크 전송' })] }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: "auth-footer", children: (0, jsx_runtime_1.jsx)(Link, { href: loginHref, children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30" }) }))] }) }));
}
