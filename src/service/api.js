import axios from 'axios';
import store from '../store'
import Helper from './helper';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

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
  },

  uploadFile(req) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      return Promise.reject();
    } else {
      return axios.post(req.url, req.file, { headers: { 'Content-Type': 'text/csv' } });
    }
  },

  downloadFile(req) {
    let type = 'text/csv';
    if (req.form && req.form.reportUnit) {
      if (req.form.reportUnit == 'Excel')
        type = 'application/vnd.ms-excel';
      else if (req.form.reportUnit == 'Pdf')
        type = 'application/pdf';
    }

    return axios.get(req.url + (req.form ? Helper.toQueryString(req.form) : ''), { responseType: 'blob' })
      .then(res => {
        if (res && res.status == 200) {
          const blob = new Blob([res.data], { type });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = req.fileName;
          link.click();
          URL.revokeObjectURL(link.href);
        } else {
          store.commit('snackbar/setMessage', { text: res.data.reason, level: 'error' });
        }
      }).catch(async (err) => {
        if (err.response) {
          let errorJSON = err.response.data;
          if (
              err.request.responseType === 'blob' &&
              err.response.data instanceof Blob &&
              err.response.data.type &&
              err.response.data.type.toLowerCase().indexOf('json') != -1
          ) {
            errorJSON = JSON.parse(await err.response.data.text());
          }
          store.commit('snackbar/setMessage', 
            { 
              text: (errorJSON.reason || errorJSON.message), 
              color: (errorJSON.reason ? 'warning' : 'error'), 
              timeout: 2100
            }
          );
        } else {
          store.commit('snackbar/setMessage', { text: err.message, level: 'error' });
        }
      });
  }

};
