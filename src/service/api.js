import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.withCredentials = true

export default {

  setSessionNo() {
    const urlParts = window.location.pathname.split('/');
    if (urlParts && urlParts.length) {
      const no = urlParts[1];
      if (!isNaN(+no)) {
        axios.defaults.headers.common['X-Session'] = no;
      }
    }
  },

  get(resource, parameters) {
    this.setSessionNo();
    return axios.get(resource, { params: parameters });
  },

  delete(resource, parameters) {
    this.setSessionNo();
    return axios.delete(resource, { params: parameters });
  },

  post(resource, data) {
    this.setSessionNo();
    return axios.post(resource, data);
  },

  put(resource, data) {
    this.setSessionNo();
    return axios.put(resource, data);
  },

  customRequest(data) {
    this.setSessionNo();
    return axios(data);
  }

};
