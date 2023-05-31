<script>
/* eslint-disable valid-jsdoc */
/* eslint-disable one-var */
/* eslint-disable vue/multi-word-component-names */
import {mapMutations, mapGetters, mapActions} from "vuex";
import {getComponent} from "../../../src/utils/getComponent";
import getters from "../store/gettersLogin";
import mutations from "../store/mutationsLogin";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {translateKeyWithPlausibilityCheck} from "../../../src/utils/translateKeyWithPlausibilityCheck.js";
import configLogin from "../configs/config.login.js";
import Cookie from "../utils/utilsCookies";
import Utils from "../utils/utilsLogin";
import OIDC from "../utils/utilsOIDC";
import store from "../../../src/app-store/index";

export default {
    name: "Login",
    components: {
        ToolTemplate
    },
    data () {
        return {
            storePath: this.$store.state?.Tools?.Login,
            contentConfig: configLogin,
            htmlContent: null
        };
    },
    computed: {
        ...mapGetters("Tools/Login", Object.keys(getters))
    },
    watch: {
    /**
     * Listens to the active property change.
     * @param {Boolean} isActive Value deciding whether the tool gets activated or deactivated.
     * @returns {void}
     */
        active (isActive) {
            if (isActive) {
                if (
                    Object.prototype.hasOwnProperty.call(this.contentConfig, "active") &&
          this.contentConfig.active === true
                ) {
                    this.htmlContent = this.contentConfig.content;

                    if (!this.checkLoggedIn()) {
                        this.login();
                    }

                }
                else {
                    console.warn("Login addon is not activated.");
                }
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    mounted () {
        this.$nextTick(() => {
            this.initialize();
        });

        this.checkLoggedIn();
        setInterval(() => this.checkLoggedIn(), 10_000); // check every 10 seconds
    },
    methods: {
        ...mapMutations("Tools/Login", Object.keys(mutations)),
        ...mapActions("Tools/Login", ["initialize"]),
        translateKeyWithPlausibilityCheck,

        /**
     * Translates the given translationKey or keeps a given text as it is if no translationKey is detected.
     * @param {String} translationKey the value or key to translate, if this is not a translation key, it will return the value as it is
     * @param {Object} [options=null] the options to use for the translation, if given translationKey must be a translation key
     * @returns {String} the translation or the given param as it is
     */
        translate (translationKey, options = null) {
            if (typeof options === "object" && options !== null) {
                return i18next.t(translationKey, options);
            }
            return this.translateKeyWithPlausibilityCheck(translationKey, (v) => i18next.t(v)
            );
        },

        /**
     * returns the config from config.js
     * @returns {Object|Boolean} the config object or false on error
     */
        getConfigObject () {
            if (typeof Config === "object" && Config !== null) {
                if (typeof Config.login === "object" && Config.login !== null) {
                    return Config.login;
                }
            }
            return false;
        },

        getTitle () {
            return this.loggedIn ? "Logout" : "Login";
        },

        /**
         * Returns true iff user is logged in, else false
         * @returns Boolean logged in
         */
        checkLoggedIn () {

            const token = Cookie.get("token");

            store.commit("Tools/Login/setAccessToken", token);

            // eslint-disable-next-line one-var
            const refreshToken = Cookie.get("refresh_token");

            store.commit("Tools/Login/setRefreshToken", refreshToken);

            // check if token is expired
            if (this.getTokenExpiry() < 1) {
                this.logout();
                return false;
            }

            // if not, start renewing the token (if necessary)

            this.renewToken();


            // set logged into store
            // eslint-disable-next-line one-var
            const loggedIn = Boolean(token);

            store.commit("Tools/Login/setLoggedIn", loggedIn);

            // set name and email into store
            store.commit("Tools/Login/setScreenName", Cookie.get("name"));
            store.commit("Tools/Login/setUsername", Cookie.get("username"));
            store.commit("Tools/Login/setEmail", Cookie.get("email"));

            // set login icon
            this.setLoginIcon();

            return loggedIn;
        },

        /**
         * Returns authentication URL
         *
         * @param {String} clientId the client ID
         * @param {String} redirectUri URL for redirection after login
         */
        async getAuthCodeUrl () {
            const oidcAuthorizationEndpoint = this.getConfigObject()?.oidcAuthorizationEndpoint || this.oidcAuthorizationEndpoint,
                oidcClientId = this.getConfigObject()?.oidcClientId || this.oidcClientId,
                oidcRedirectUri = this.getConfigObject()?.oidcRedirectUri || this.oidcRedirectUri,
                oidcScope = this.getConfigObject()?.oidcScope || this.oidcScope,

                url = await OIDC.getAuthCodeUrl(oidcAuthorizationEndpoint, oidcClientId, oidcRedirectUri, oidcScope);

            return url;
        },

        /**
     * Opens a login popup and stores retrieved login data into store
     */
        async login () {
            // open javascript window
            const params = "width=500,height=500,status=no,location=no,menubar=no," +
                    `top=${window.screenY + (window.outerHeight - 500) / 2.5},` +
                    `left=${window.screenX + (window.outerWidth - 500) / 2}`,

                loginPopup = window.open(await this.getAuthCodeUrl(), "Login", params);

            // check every x milliseconds if dialog has been closed
            // eslint-disable-next-line one-var
            const timer = setInterval(() => {
                if (loginPopup.closed) {
                    clearInterval(timer);

                    // dialog has been closed, login successful?
                    // this.checkLoggedIn();

                    // reload window since it cannot partially update at the moment (TODO)
                    location.reload();
                }
            }, 500);
        },

        /**
     * Removes all cookies and clears store
     */
        logout (reload = false) {
            // close login window
            this.close();

            // erase all cookies
            OIDC.eraseCookies();

            // reset the store
            store.commit("Tools/Login/setLoggedIn", false);
            store.commit("Tools/Login/setAccessToken", undefined);
            store.commit("Tools/Login/setRefreshToken", undefined);
            store.commit("Tools/Login/setScreenName", undefined);
            store.commit("Tools/Login/setUsername", undefined);
            store.commit("Tools/Login/setEmail", undefined);

            // set icon to reflect login state
            this.setLoginIcon();

            // reload window since it cannot partially update at the moment (TODO)
            if (reload) {
                location.reload();
            }
        },

        /**
     * Renews the token when the token is about to expire
     */
        async renewToken () {

            const expiry = this.getTokenExpiry();

            // if the token will expire in the next 5 minutes, let's refresh
            if (expiry > 0 && expiry <= 360_000) {

                const oidcTokenEndpoint = this.getConfigObject()?.oidcTokenEndpoint || this.oidcTokenEndpoint,
                    oidcClientId = this.getConfigObject()?.oidcClientId || this.oidcClientId,
                    refreshToken = Cookie.get("refresh_token"),

                    req = OIDC.refreshToken(oidcTokenEndpoint, oidcClientId, refreshToken);

                if (req.status === 200) {
                    const response = JSON.parse(req.response);

                    OIDC.setCookies(response.access_token, response.id_token, response.expires_in, response.refresh_token);
                }
                else {
                    console.error("Could not refresh token.", req.response);
                }
            }
        },

        /**
     * Returns expiry in miliseconds from existing token.
     * Returns 0, if token is already expired or not existing.
     */
        getTokenExpiry () {
            if (this.accessToken) {
                const account = Utils.parseJwt(this.accessToken),
                    expiry = account.exp ? account.exp * 1000 : 0,
                    timeToExpiry = expiry - Date.now();

                return Math.max(0, timeToExpiry);
            }
            return 0;

        },

        /**
     * Adds a login icon in the search bar
     */
        setLoginIcon () {

            // update icon if appropriate (Desktop menu)
            const loginItemDesktop = document.querySelector("#navbarMenu .nav-menu.desktop li.nav-item[title=Login]");

            if (loginItemDesktop) {
                if (this.storePath?.loggedIn) {
                    loginItemDesktop.innerHTML = loginItemDesktop.innerHTML.replaceAll(this.iconLogin, this.iconLogged);
                    loginItemDesktop.innerHTML = loginItemDesktop.innerHTML.replaceAll("Login", "Logout");
                }
                else {
                    loginItemDesktop.innerHTML = loginItemDesktop.innerHTML.replaceAll(this.iconLogged, this.iconLogin);
                    loginItemDesktop.innerHTML = loginItemDesktop.innerHTML.replaceAll("Logout", "Login");
                }
            }

            // update icon if appropriate (Mobile menu)
            const loginItemMobileIcon = document.querySelector("#navbarMenu .nav-menu.mobile li span[name=login]");

            if (loginItemMobileIcon) {
                const loginItemMobileText = loginItemMobileIcon.nextElementSibling;

                if (this.storePath?.loggedIn) {
                    loginItemMobileIcon.innerHTML = loginItemMobileIcon.innerHTML.replaceAll(this.iconLogin, this.iconLogged);
                    loginItemMobileText.innerHTML = loginItemMobileText.innerHTML.replaceAll("Login", "Logout");
                }
                else {
                    loginItemMobileIcon.innerHTML = loginItemMobileIcon.innerHTML.replaceAll(this.iconLogged, this.iconLogin);
                    loginItemMobileText.innerHTML = loginItemMobileText.innerHTML.replaceAll("Logout", "Login");
                }
            }
        },

        /**
     * Closes the window of login by setting store active to false.
     * @pre window is opened
     * @post window is closed
     * @returns {void}
     */
        close () {
            this.setActive(false);

            // The value "isActive" of the Backbone model is also set to false to change the CSS class in the menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = getComponent(this.storePath?.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="getTitle()"
        :icon="iconLogin"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-g-f-i="deactivateGFI"
        class="login-window"
    >
        <template #toolBody>
            <div
                v-show="!screenName && !email"
                class="progress-loader"
            >
                <div class="loader" />
                <span>{{ $t('additional:modules.tools.login.progress') }}</span>
            </div>
            <div v-show="screenName">
                <span>Name:</span>
                <span>{{ screenName }}</span>
            </div>
            <div v-show="email">
                <span>E-Mail:</span>
                <span>{{ email }}</span>
            </div>
            <div><p>&nbsp;</p></div>
            <button
                id="logout-button"
                class="btn btn-logout"
                type="button"
                title="Logout"
                @click="logout(true)"
            >
                <span class="bootstrap-icon logout-icon">
                    <i
                        id="logout-icon"
                        class="bi-door-closed"
                    /> Logout
                </span>
            </button>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";
.login-window {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.176);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  z-index: 2000;
}
.progress-loader {
  display: flex;
  flex-direction: row;
}
.loader {
  border: 3px solid #f3f3f3; /* Light grey */
  border-top: 3px solid #333333; /* Grey */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite;
  display: inline;
  margin-right: 10px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<style>
li.nav-item[title="Login"] a {
    margin: 0px 20px;
}
li.nav-item[title="Login"] a {
    background-color: rgb(33, 147, 201);
    padding: 3px 7px;
    border-radius: 17px;
    color: white;
    margin: 12px 0px;
    font-weight: normal;
}

#root .dropdown {
    border-right: none !important;
}
</style>
