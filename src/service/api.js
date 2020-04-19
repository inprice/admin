import axios from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
axios.defaults.headers.common['X-Session'] = 0;
axios.defaults.withCredentials = true

export default {

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
  }

};
