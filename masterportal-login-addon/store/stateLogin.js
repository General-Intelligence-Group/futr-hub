
/**
 * User type definition
 * @typedef {Object} LoginState
 * @property {Boolean} active if true, login is rendered
 *
 * @property {Boolean} loggedIn if true, user is logged in
 * @property {String} username the user that is logged in, otherwise undefined
 * @property {String} screenName the user's name that is shown in the frontend or undefined if not logged in
 * @property {String} token the oidc token, if logged in, and undefined otherwise
 *
 * @property {String}   id - internal id of component
 * @property {String}   name - Module name
 * @property {String}   icon - icon next to title
 * @property {Boolean}  renderToWindow - if true, component is rendered in a window pane instead of sidebar
 * @property {Boolean}  resizableWindow - if true and if rendered to window pane, the pane is resizable
 * @property {Boolean}  deactivateGFI - if true, component activation deactivates gfi component
 */
const state = {
    active: false,

    // login state
    loggedIn: false,
    username: undefined,
    screenName: undefined,
    email: undefined,
    accessToken: undefined,
    refreshToken: undefined,

    // oidc settings
    oidcAuthorizationEndpoint: "https://idm.domain.de/auth/realms/REALM/protocol/openid-connect/auth",
    oidcTokenEndpoint: "https://idm.domain.de/auth/realms/REALM/protocol/openid-connect/token",
    oidcClientId: "masterportal",
    oidcScope: "profile email openid",
    oidcRedirectUri: window.location.href.split("?")[0],

    // addon state and properties
    id: "filter",
    name: "common:menu.tools.filter",
    iconLogin: "bi-door-open",
    iconLogout: "bi-door-closed",
    iconLogged: "bi-person-circle",
    renderToWindow: true,
    resizableWindow: true,
    deactivateGFI: false
};

export default state;
