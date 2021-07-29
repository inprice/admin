import ApiService from './api';
import store from '../store'
import router from '../router';

function logoutCheck(reason, manualErrorHandling) {
  if (reason.includes("sign in") || reason.includes("be expired") || (reason.includes("Network Error") && !window.location.href.includes("/login"))) {
    store.dispatch('session/logout', true);
  } else if (!manualErrorHandling) {
    store.commit('snackbar/setMessage', { text: reason, level: 'error' });
  }
}

export default {

  toQueryString(form) {
    return '?' + Object.keys(form).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(form[key])
    }).join('&');    
  },

  async call(caller, req, manualErrorHandling) {
    try {
      if (! req.method || req.method === undefined) req.method = 'post';
      const res = await ApiService.customRequest(req);
      if (res) {
        if (res.status == 200) {
          if (res.data.ok) {
            return { data: res.data.data, status: true };
          } else {
            logoutCheck(res.data.reason, manualErrorHandling);
            return { error: res.data.reason, status: false };
          }
        } else {
          if (res.status == 403) {
            router.push({ name: 'forbidden' });
            return;
          }
          logoutCheck(res.data.reason);
          return { error: res.data.reason, status: false };
        }
      } else {
        return { error: 'Network Error', status: false };
      }
    } catch (err) {
      if (err.message.includes("code 400")) {
        store.commit('snackbar/setMessage', { text: 'Invalid data', level: 'error' });
      } else {
        logoutCheck(err.message);
      }
      return { error: err.message, status: false };
    }
  }

};
