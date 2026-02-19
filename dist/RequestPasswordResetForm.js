"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordResetForm = RequestPasswordResetForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const form_layout_props_1 = require("./form-layout-props");
/**
 * 비밀번호 재설정 요청 폼. 이메일 입력 후 POST /api/auth/request-password-reset.
 * 스타일: '@laivdata/auth-ui-react/styles.css'
 */
function RequestPasswordResetForm({ config, context, resetPasswordBaseUrl, workspaceName, loginHref, layout = 'fullpage', onSuccess, className, containerClassName, cardClassName, formClassName, headerClassName, footerClassName, style, containerStyle, cardStyle, formStyle, headerStyle, footerStyle, }) {
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
    if (sent) {
        const sentCard = ((0, jsx_runtime_1.jsxs)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-card', cardClassName ?? className), style: cardStyle ?? style, "data-testid": "request-password-reset-sent", children: [(0, jsx_runtime_1.jsxs)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-header', headerClassName), style: headerStyle, children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uC774\uBA54\uC77C \uBC1C\uC1A1 \uC644\uB8CC" })] }), (0, jsx_runtime_1.jsx)("div", { className: "alert alert-success", role: "status", children: "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815 \uBA54\uC77C\uC744 \uBCF4\uB0C8\uC2B5\uB2C8\uB2E4. \uC774\uBA54\uC77C\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694." }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-footer', footerClassName), style: footerStyle, children: (0, jsx_runtime_1.jsx)("a", { href: loginHref, children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30" }) }))] }));
        return layout === 'card' ? sentCard : ((0, jsx_runtime_1.jsx)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-container', containerClassName), style: containerStyle, children: sentCard }));
    }
    const card = ((0, jsx_runtime_1.jsxs)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-card', cardClassName ?? className), style: cardStyle ?? style, "data-testid": "request-password-reset-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-header', headerClassName), style: headerStyle, children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815" })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert-danger", role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: (0, form_layout_props_1.mergeClassName)('auth-form', formClassName), style: formStyle, onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "request-password-reset-email", children: "\uC774\uBA54\uC77C \uC8FC\uC18C" }), (0, jsx_runtime_1.jsx)("input", { id: "request-password-reset-email", type: "email", name: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "request-password-reset-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary", disabled: loading, "data-testid": "request-password-reset-submit", children: loading ? '전송 중...' : '재설정 링크 전송' })] }), loginHref && ((0, jsx_runtime_1.jsx)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-footer', footerClassName), style: footerStyle, children: (0, jsx_runtime_1.jsx)("a", { href: loginHref, children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30" }) }))] }));
    if (layout === 'card')
        return card;
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-container', containerClassName), style: containerStyle, children: card }));
}
