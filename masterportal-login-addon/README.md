# Masterportal Login AddOn

This addon allows the user to login with an OIDC server. The retrieved access token is stored in cookies which can be used by the backend to deliver user-specific data (e.g. layers).

## Installation/Build and Configuration

To build this addon into the masterportal, copy the addon into the addon folder and add the following to your `addonsConf.json` (please create the file if not existing):

```json
{
  "login": {
    "vue": true,
    "type": "tool"
  }
}
```

Add the addon to your `config.js` as follows:

```js
const Config = {
  addons: ["login"],
  login: {
      oidcAuthorizationEndpoint: "https://idm.DOMAIN.de/auth/realms/REALM/protocol/openid-connect/auth",
      oidcTokenEndpoint: "https://idm.DOMAIN.de/auth/realms/REALM/protocol/openid-connect/token",
      oidcClientId: "masterportal",
      oidcRedirectUri: "https://localhost/portal/basic/",
      interceptorUrlRegex: "https?://localhost.*" // add authorization to all URLs that match the given regex
  },

  ...
```

Adjust the settings as required.

Finally, add the login tool to the `tools.children` section in the `config.json`:

```json
  "login": {
    "name": "translate#additional:modules.tools.login.title",
    "icon": "bi-door-open"
  }
```

Build the masterportal as usual.

## Keycloak Configuration

Make sure in keycloak the client is configured as follows:

```
Access Type: public
Standard Flow Enabled: ON
Valid Redirect URIs: <PORTAL URL, e.g. https://localhost/*>
Web Origins: <PORTAL HOST, e.g. https://localhost>
```

Specific ports are not allowed ports here. Especially, ports on localhost, e.g. `localhost:9001` will not work with keycloak since ports are not accepted in web origins.

In the section `OpenID Connect Compatibility Modes` activate `Use Refresh Tokens`. In the section `Advanced Settings` set `Proof Key for Code Exchange Code Challenge Method` to `S256`.

