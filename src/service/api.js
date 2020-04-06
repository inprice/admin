import axios from 'axios';
import SessionService from './session';

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
              const result = await this.refreshToken();
              if (result == true) {
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
          }
        } else {
          throw error;
        }
      }
    )
  },

  unmountInterceptor() {
    if (this.interceptor) {
      axios.interceptors.response.eject(this.interceptor);
      this.interceptor = null;
    }
  },

  async refreshToken() {
    this.setHeader(SessionService.getRefreshToken());
    const apiRes = await this.post('/refresh-token');
    if (apiRes && apiRes.data.status == 0) {
      this.saveSessionInfo(apiRes.data.data);
      return true;
    }
    return false;
  },

  saveSessionInfo(res) {
    const info = {
      access: res.access,
      refresh: res.refresh,
      user: res.user
    };
    SessionService.saveSessionInfo(info);
    this.setHeader(info.access);
    this.mountInterceptor();
  },

  removeSessionInfo() {
    SessionService.removeSessionInfo();
    this.removeHeader();
    this.unmountInterceptor();
  }

};
