"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFormCustom = RegisterFormCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 100;
const DISPLAY_NAME_MIN = 2;
const DISPLAY_NAME_MAX = 50;
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, children: children }));
const DefaultCard = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "register-form-custom", children: children }));
const DefaultInput = (props) => (0, jsx_runtime_1.jsx)("input", { ...props });
const DefaultLabel = ({ htmlFor, children }) => ((0, jsx_runtime_1.jsx)("label", { htmlFor: htmlFor, children: children }));
const DefaultButton = (props) => (0, jsx_runtime_1.jsx)("button", { ...props });
const DefaultAlert = ({ children, role = 'alert' }) => ((0, jsx_runtime_1.jsx)("div", { role: role, children: children }));
const DefaultLink = (props) => ((0, jsx_runtime_1.jsx)("a", { ...props }));
/**
 * 회원가입 폼 주입용 래퍼. RegisterForm과 동일 로직 + components로 UI만 주입.
 * components 미지정 시 기본 div/input/button으로 동작.
 */
function RegisterFormCustom({ config, workspaceName, loginHref, resendVerificationHref, verificationBaseUrl, onSuccess, components: componentsProp, }) {
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
    const Container = componentsProp?.Container ?? DefaultContainer;
    const Card = componentsProp?.Card ?? DefaultCard;
    const Input = componentsProp?.Input ?? DefaultInput;
    const Label = componentsProp?.Label ?? DefaultLabel;
    const Button = componentsProp?.Button ?? DefaultButton;
    const Alert = componentsProp?.Alert ?? DefaultAlert;
    const Link = componentsProp?.Link ?? DefaultLink;
    const hasFooterLinks = !!(loginHref || resendVerificationHref);
    return ((0, jsx_runtime_1.jsx)(Container, { className: "auth-container", style: {}, children: (0, jsx_runtime_1.jsxs)(Card, { className: "auth-card", style: {}, children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uD68C\uC6D0\uAC00\uC785" })] }), error && ((0, jsx_runtime_1.jsx)(Alert, { role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: "auth-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "register-displayName-custom", children: "\uC774\uB984" }), (0, jsx_runtime_1.jsx)(Input, { id: "register-displayName-custom", type: "text", name: "displayName", value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "\uC774\uB984", required: true, minLength: DISPLAY_NAME_MIN, maxLength: DISPLAY_NAME_MAX, "data-testid": "register-displayName", autoComplete: "name" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "register-email-custom", children: "\uC774\uBA54\uC77C" }), (0, jsx_runtime_1.jsx)(Input, { id: "register-email-custom", type: "email", name: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "\uC774\uBA54\uC77C", required: true, "data-testid": "register-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "register-password-custom", children: "\uBE44\uBC00\uBC88\uD638" }), (0, jsx_runtime_1.jsx)(Input, { id: "register-password-custom", type: "password", name: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: `${PASSWORD_MIN}자 이상 ${PASSWORD_MAX}자 이하`, required: true, minLength: PASSWORD_MIN, maxLength: PASSWORD_MAX, "data-testid": "register-password", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "register-confirmPassword-custom", children: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778" }), (0, jsx_runtime_1.jsx)(Input, { id: "register-confirmPassword-custom", type: "password", name: "confirmPassword", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778", required: true, "data-testid": "register-confirmPassword", autoComplete: "new-password" })] }), (0, jsx_runtime_1.jsx)(Button, { type: "submit", disabled: loading, "data-testid": "register-submit", children: loading ? '가입 중...' : '회원가입' })] }), hasFooterLinks && ((0, jsx_runtime_1.jsxs)("div", { className: "auth-footer", children: [loginHref && ((0, jsx_runtime_1.jsx)(Link, { href: loginHref, "data-testid": "register-login-link", children: "\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694?" })), resendVerificationHref && ((0, jsx_runtime_1.jsx)(Link, { href: resendVerificationHref, "data-testid": "register-resend-link", children: "\uC774\uBA54\uC77C \uC778\uC99D\uC744 \uC7AC\uC804\uC1A1\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?" }))] }))] }) }));
}
