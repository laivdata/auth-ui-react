"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginFormCustom = LoginFormCustom;
const jsx_runtime_1 = require("react/jsx-runtime");
const hooks_1 = require("./hooks");
/** loginUrl에 redirect_uri, workspace_id 쿼리 추가 (API 조회 결과 URL용) */
function buildOAuth2Link(info, redirectUri, workspaceId) {
    if (!redirectUri && !workspaceId)
        return info.loginUrl;
    const params = new URLSearchParams();
    if (redirectUri)
        params.set('redirect_uri', redirectUri);
    if (workspaceId)
        params.set('workspace_id', workspaceId);
    const sep = info.loginUrl.includes('?') ? '&' : '?';
    return `${info.loginUrl}${sep}${params.toString()}`;
}
function getOAuthButtonLabel(provider, displayName) {
    const labels = {
        google: '구글',
        naver: '네이버',
        kakao: '카카오',
        apple: '애플',
    };
    const key = provider.toLowerCase();
    const name = labels[key] ?? displayName;
    return `${name} 계정으로 로그인`;
}
const DefaultContainer = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, children: children }));
const DefaultCard = ({ children, className, style, }) => ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, "data-testid": "login-form-custom", children: children }));
const DefaultInput = (props) => (0, jsx_runtime_1.jsx)("input", { ...props });
const DefaultLabel = ({ htmlFor, children }) => ((0, jsx_runtime_1.jsx)("label", { htmlFor: htmlFor, children: children }));
const DefaultButton = (props) => (0, jsx_runtime_1.jsx)("button", { ...props });
const DefaultAlert = ({ children, role = 'alert' }) => ((0, jsx_runtime_1.jsx)("div", { role: role, children: children }));
const DefaultLink = (props) => ((0, jsx_runtime_1.jsx)("a", { ...props }));
const DefaultOAuthButton = ({ href, label, 'data-testid': testId, children }) => ((0, jsx_runtime_1.jsxs)("a", { href: href, role: "button", "data-testid": testId, children: [children, label] }));
/**
 * 로그인 폼 주입용 래퍼. useLoginForm 로직 + components로 UI만 주입.
 * components 미지정 시 기본 div/input/button으로 동작.
 */
function LoginFormCustom({ config, workspaceId, redirectUri, providers: providersProp, workspaceName, registerHref, resetPasswordHref, onSuccess, components: componentsProp, }) {
    const { email, setEmail, password, setPassword, loading, error, handleSubmit, oauthProviders, } = (0, hooks_1.useLoginForm)({
        config,
        workspaceId,
        redirectUri,
        providers: providersProp,
        onSuccess,
    });
    const Container = componentsProp?.Container ?? DefaultContainer;
    const Card = componentsProp?.Card ?? DefaultCard;
    const Input = componentsProp?.Input ?? DefaultInput;
    const Label = componentsProp?.Label ?? DefaultLabel;
    const Button = componentsProp?.Button ?? DefaultButton;
    const Alert = componentsProp?.Alert ?? DefaultAlert;
    const Link = componentsProp?.Link ?? DefaultLink;
    const OAuthButton = componentsProp?.OAuthButton ?? DefaultOAuthButton;
    const hasFooterLinks = !!(registerHref || resetPasswordHref);
    return ((0, jsx_runtime_1.jsx)(Container, { className: "auth-container", style: {}, children: (0, jsx_runtime_1.jsxs)(Card, { className: "auth-card", style: {}, children: [(0, jsx_runtime_1.jsxs)("div", { className: "auth-header", children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uB85C\uADF8\uC778" })] }), error && ((0, jsx_runtime_1.jsx)(Alert, { role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: "auth-form", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "login-email-custom", children: "\uC774\uBA54\uC77C" }), (0, jsx_runtime_1.jsx)(Input, { id: "login-email-custom", type: "email", name: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "\uC774\uBA54\uC77C", required: true, "data-testid": "login-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)(Label, { htmlFor: "login-password-custom", children: "\uBE44\uBC00\uBC88\uD638" }), (0, jsx_runtime_1.jsx)(Input, { id: "login-password-custom", type: "password", name: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\uBE44\uBC00\uBC88\uD638", required: true, "data-testid": "login-password", autoComplete: "current-password" })] }), (0, jsx_runtime_1.jsx)(Button, { type: "submit", disabled: loading, "data-testid": "login-submit", children: loading ? '로그인 중...' : '로그인' })] }), hasFooterLinks && ((0, jsx_runtime_1.jsxs)("div", { className: "auth-footer", children: [registerHref && ((0, jsx_runtime_1.jsx)(Link, { href: registerHref, "data-testid": "login-register-link", children: "\uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694?" })), resetPasswordHref && ((0, jsx_runtime_1.jsx)(Link, { href: resetPasswordHref, "data-testid": "login-reset-password-link", children: "\uBE44\uBC00\uBC88\uD638\uB97C \uC78A\uC73C\uC168\uB098\uC694?" }))] })), oauthProviders.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "social-login", children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("span", { children: "or" }) }), (0, jsx_runtime_1.jsx)("div", { className: "social-buttons", children: oauthProviders.map((p) => {
                                const url = providersProp != null && providersProp.length > 0
                                    ? p.loginUrl
                                    : buildOAuth2Link(p, redirectUri, workspaceId);
                                const label = getOAuthButtonLabel(p.provider, p.displayName);
                                return ((0, jsx_runtime_1.jsx)(OAuthButton, { href: url, provider: p.provider, label: label, "data-testid": `oauth2-${p.provider.toLowerCase()}` }, p.provider));
                            }) })] }))] }) }));
}
