import axios from "axios";

function addInterceptor(token, interceptorUrlRegex) {
    // Request interceptors for API calls
    axios.interceptors.request.use(
        config => {
            if (!config.url?.startsWith("http") || (interceptorUrlRegex && config.url?.match(interceptorUrlRegex))) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    (function(open) {
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            const opened = open.call(this, method, url, ...rest);
            if (interceptorUrlRegex && this.responseURL?.match(interceptorUrlRegex)) {
                this.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            return opened;
        };
    })(XMLHttpRequest.prototype.open);

    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
        let [resource, config ] = args;

        if (interceptorUrlRegex && resource?.match(interceptorUrlRegex)) {
            config = {
                ...config,
                credentials: 'include'
            };
        }

        // request interceptor here
        const response = await originalFetch(resource, config);

        // response interceptor here
        return response;
    };

}

export default {
    addInterceptor
}
