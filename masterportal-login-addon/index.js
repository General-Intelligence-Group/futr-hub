// myMasterPortalFolder/addons/vueAddon/index.js

import LoginComponent from "./components/Login.vue";
import LoginStore from "./store/indexLogin";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

import Cookie from './utils/utilsCookies'
import Utils from './utils/utilsLogin'
import OIDC from './utils/utilsOIDC'
import AxiosUtils from './utils/utilsAxios'


/**
 * Perform oidc login, if url parameter is present
 */
if(window.location.search) {
    const urlParams = new URLSearchParams(window.location.search);

    // a little bit styling for response messages
    if(urlParams.has('error') || urlParams.has('code')) {
        document.querySelector("body").style.setProperty("margin", "10px");
    }

    // Check if the server returned an error string
    if(urlParams.has('error')) {
        const error = urlParams.get('error')
        const error_description = urlParams.get('error_description')
        document.querySelector("body").innerHTML = "<h1>"+error+"</h1><p>"+error_description+"</p>";
    }

    // If the server returned an authorization code, try to trade it for an access token
    if (urlParams.has('code')) {
        const code = urlParams.get('code')
        const state = urlParams.get('state')

        // Verify state matches what we set at the beginning
        if(OIDC.getState() != state) {
            document.querySelector("body").innerHTML = "<h1>Invalid state</h1>";
        }

        // state is correct
        else {

            // this is kind of "hacky" to stop vue from rendering
            document.querySelector("#masterportal-root").remove();

            const config = Utils.getConfigObject();
            const req = OIDC.getToken(config.oidcTokenEndpoint, config.oidcClientId, config.oidcRedirectUri, code)

            // put token into cookie, if token exists (login succeeded)
            if (req.status === 200) {
                const response = JSON.parse(req.response)

                OIDC.setCookies(response.access_token, response.id_token, response.expires_in, response.refresh_token)

                document.querySelector("body").innerHTML = "user logged in: " + (Cookie.get('email') || 'no email defined for user');
            }

            // login failed
            else {
                OIDC.eraseCookies()
                document.querySelector("body").innerHTML = 'Status: ' + req?.status + ' ' + req?.responseText
            }

            // for redirects close popup window
            window.close();

        }
    }
}

// check if token is set in cookie
const token = Cookie.get("token");
if (token !== undefined) {

    // check token expiry
    const account = Utils.parseJwt(token);
    const expiry = account.exp ? account.exp*1000 : Date.now() + 10_000;

    if (Date.now() > expiry) {
        OIDC.eraseCookies()
    }

    // add axios interceptor
    const config = Utils.getConfigObject();
    AxiosUtils.addInterceptor(token, config?.interceptorUrlRegex);
}

export default {
    component: LoginComponent,
    store: LoginStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
}
