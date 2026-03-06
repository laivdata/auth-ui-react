"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForm = LoginForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const form_layout_props_1 = require("./form-layout-props");
const hooks_1 = require("./hooks");
/** 인증 서버 FE와 동일한 OAuth 버튼 문구 (한글) */
const OAUTH_BUTTON_LABEL = {
    google: '구글',
    naver: '네이버',
    kakao: '카카오',
    apple: '애플',
};
function getOAuthButtonLabel(provider, displayName) {
    const key = provider.toLowerCase();
    const name = OAUTH_BUTTON_LABEL[key] ?? displayName;
    return `${name} 계정으로 로그인`;
}
/** 소셜 로그인 아이콘 (인증 서버 login.html과 동일) */
function OAuthIcon({ provider }) {
    const p = provider.toLowerCase();
    if (p === 'naver') {
        return ((0, jsx_runtime_1.jsx)("svg", { width: "16", height: "16", viewBox: "0 0 19 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: (0, jsx_runtime_1.jsx)("path", { d: "M12.8 10.1L5.8 0H0V19H6.2V8.9L13.2 19H19V0H12.8V10.1Z", fill: "white" }) }));
    }
    if (p === 'kakao') {
        return ((0, jsx_runtime_1.jsx)("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10 0C4.477 0 0 3.537 0 7.903C0 10.671 1.875 13.113 4.714 14.528L3.536 18.534C3.453 18.816 3.77 19.041 4.017 18.879L8.747 15.693C9.157 15.736 9.574 15.758 10 15.758C15.523 15.758 20 12.222 20 7.903C20 3.537 15.523 0 10 0Z", fill: "black" }) }));
    }
    if (p === 'google') {
        return ((0, jsx_runtime_1.jsxs)("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": true, children: [(0, jsx_runtime_1.jsx)("path", { d: "M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z", fill: "#4285F4" }), (0, jsx_runtime_1.jsx)("path", { d: "M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z", fill: "#34A853" }), (0, jsx_runtime_1.jsx)("path", { d: "M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z", fill: "#FBBC05" }), (0, jsx_runtime_1.jsx)("path", { d: "M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z", fill: "#EA4335" })] }));
    }
    return null;
}
/** loginUrl에 redirect_uri, workspace_id 쿼리 추가 (API 조회 시 반환된 URL용) */
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
/**
 * 로그인 폼: 인증 서버 FE와 동일한 디자인(카드·헤더·폼·푸터·소셜).
 * config.authServerBaseUrl 기준으로 GET /api/auth/oauth2/providers를 호출해 사용 가능한 제공자만 자동 표시합니다.
 * 스타일 적용을 위해 '@laivdata/auth-ui-react/styles.css'를 import 하세요.
 */
function LoginForm({ config, workspaceId, redirectUri, providers: providersProp, workspaceName, registerHref, resetPasswordHref, layout = 'fullpage', onSuccess, className, containerClassName, cardClassName, formClassName, headerClassName, footerClassName, style, containerStyle, cardStyle, formStyle, headerStyle, footerStyle, }) {
    const { email, setEmail, password, setPassword, loading, error, handleSubmit: handleLocalLogin, oauthProviders: oauth2Providers, } = (0, hooks_1.useLoginForm)({
        config,
        workspaceId,
        redirectUri,
        providers: providersProp,
        onSuccess,
    });
    const hasFooterLinks = !!(registerHref || resetPasswordHref);
    const card = ((0, jsx_runtime_1.jsxs)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-card', cardClassName ?? className), style: cardStyle ?? style, "data-testid": "login-form", children: [(0, jsx_runtime_1.jsxs)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-header', headerClassName), style: headerStyle, children: [workspaceName && (0, jsx_runtime_1.jsx)("h2", { children: workspaceName }), (0, jsx_runtime_1.jsx)("p", { children: "\uB85C\uADF8\uC778" })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "alert alert-danger", role: "alert", children: error })), (0, jsx_runtime_1.jsxs)("form", { className: (0, form_layout_props_1.mergeClassName)('auth-form', formClassName), style: formStyle, onSubmit: handleLocalLogin, children: [(0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "login-email", children: "\uC774\uBA54\uC77C" }), (0, jsx_runtime_1.jsx)("input", { id: "login-email", type: "email", name: "email", placeholder: "\uC774\uBA54\uC77C", value: email, onChange: (e) => setEmail(e.target.value), required: true, "data-testid": "login-email", autoComplete: "email" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "form-group", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "login-password", children: "\uBE44\uBC00\uBC88\uD638" }), (0, jsx_runtime_1.jsx)("input", { id: "login-password", type: "password", name: "password", placeholder: "\uBE44\uBC00\uBC88\uD638", value: password, onChange: (e) => setPassword(e.target.value), required: true, "data-testid": "login-password", autoComplete: "current-password" })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn btn-primary", disabled: loading, "data-testid": "login-submit", children: loading ? '로그인 중...' : '로그인' })] }), hasFooterLinks && ((0, jsx_runtime_1.jsxs)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-footer', footerClassName), style: footerStyle, children: [registerHref && ((0, jsx_runtime_1.jsx)("a", { href: registerHref, "data-testid": "login-register-link", children: "\uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694?" })), resetPasswordHref && ((0, jsx_runtime_1.jsx)("a", { href: resetPasswordHref, "data-testid": "login-reset-password-link", children: "\uBE44\uBC00\uBC88\uD638\uB97C \uC78A\uC73C\uC168\uB098\uC694?" }))] })), oauth2Providers.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "social-login", children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("span", { children: "or" }) }), (0, jsx_runtime_1.jsx)("div", { className: "social-buttons", children: oauth2Providers.map((p) => {
                            const url = providersProp != null
                                ? p.loginUrl
                                : buildOAuth2Link(p, redirectUri, workspaceId);
                            const btnClass = `btn btn-${p.provider.toLowerCase()}`;
                            const label = getOAuthButtonLabel(p.provider, p.displayName);
                            return ((0, jsx_runtime_1.jsxs)("a", { href: url, className: btnClass, role: "button", "data-testid": `oauth2-${p.provider.toLowerCase()}`, children: [(0, jsx_runtime_1.jsx)(OAuthIcon, { provider: p.provider }), label] }, p.provider));
                        }) })] }))] }));
    if (layout === 'card') {
        return card;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, form_layout_props_1.mergeClassName)('auth-container', containerClassName), style: containerStyle, children: card }));
}
