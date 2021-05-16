import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/user';

export default {

  async search(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Search User', { url: baseURL, data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async ban(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Ban User', { url: baseURL + '/ban', data: form });
    return res;
  },

  async revokeBan(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Revoke Ban', { method: 'put', url: baseURL + '/ban-revoke/' + id });
    return res;
  },

};
