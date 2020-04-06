import ApiService from './api';
import Utility from '../helpers/utility';

export default {

  toQueryString(form) {
    return '?' + Object.keys(form).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(form[key])
    }).join('&');    
  },

  async call(caller, req) {
    try {
      if (! req.method || req.method === undefined) req.method = 'post';
      const res = await ApiService.customRequest(req);
      if (res) {
        if (res.data.status == 0) {
          return { data: res.data.data, status: true };
        } else {
          Utility.showErrorMessage(caller, 'api', res);
          return { error: res.reason, status: false };
        }
      } else {
        return { error: 'Network Error', status: false };
      }
    } catch (err) {
      Utility.showErrorMessage(caller, 'network', err);
      return { error: err.message, status: false };
    }
  }

};
