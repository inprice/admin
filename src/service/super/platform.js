import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/platform';

export default {

  async search(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Platform Search', { url: baseURL + 's/search', data: form });
    if (res.status) return res.data;
    return null;
  },

  async update(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Update', { method: 'put', url: baseURL, data: form });
    return res.status;
  },

  async toggleParked(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Toggle Parked', { method: 'put', url: baseURL + '/toggle-parked/' + id });
    return res.status;
  },

  async toggleBlocked(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Toggle Blocked', { method: 'put', url: baseURL + '/toggle-blocked/' + id });
    return res.status;
  }

};
