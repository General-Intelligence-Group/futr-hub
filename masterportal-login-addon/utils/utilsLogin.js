import isObject from "../../../src/utils/isObject";

/**
 * Return config for login, if existing.
 * The configuration is defined in config.js and loaded via <script> tag.
 *
 * @returns configuration object for login
 */
function getConfigObject() {
    if (typeof Config === "object" && Config !== null) {
      if (typeof Config.login === "object" && Config.login !== null) {
        return Config.login;
      }
    }
    return false;
}

/**
 * Clones the given object and returns the clone or false on error.
 * @param {Object} obj the object to be cloned
 * @returns {Object|Boolean} the cloned object or false if anything went wrong
 */
function cloneObject (obj) {
    if (!isObject(obj)) {
        return false;
    }

    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch (e) {
        return false;
    }
}

/**
 * Parses jwt token. This function does *not* validate the token.
 * @param {String} token jwt token to be parsed
 * @returns parsed jwt token as object
 */
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
 function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

export default {
    cloneObject,
    parseJwt,
    htmlToElement,
    getConfigObject
};
