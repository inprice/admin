import axios from 'axios';
import AuthService from './auth-service';

export default {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  setHeader(accessToken) {
    axios.defaults.headers.common['Authorization'] = accessToken;
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource, parameters) {
    return axios.get(resource, { params: parameters });
  },

  delete(resource, parameters) {
    return axios.delete(resource, { params: parameters });
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data);
  },

  // Stores the 401 interceptor position so that it can be later ejected when needed
  interceptor: null,

  mountInterceptor() {
    this.interceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.request.responseURL.includes('/logout')) return;

        if (error.request.status == 401) {
          if (!error.request.responseURL.includes('/refresh-token')) {

          try {
            const result = await AuthService.refreshToken();

            if (result) {
              const reqAgain = { method: error.config.method, url: error.request.responseURL };
              if (/p(u|os)t/gi.test(error.config.method)) {
                reqAgain.data = error.config.data;
              } else {
                reqAgain.params = error.config.params;
              }
              return this.customRequest(reqAgain);
            }
              /* eslint-disable  no-empty */
          } catch (e) { }
          AuthService.logout(true);
          return;
        }
        throw error;
      }
    }
  )},

  unmountInterceptor() {
    if (this.interceptor) {
      axios.interceptors.response.eject(this.interceptor);
      this.interceptor = null;
    }
  }
};
