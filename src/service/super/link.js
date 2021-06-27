import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/link';

export default {

  async search(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Link Search', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async getDetails(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Get Details', { method: 'get', url: baseURL + '/details/' + id });
    if (res.status == true) return res;
    return null;
  },

  async toggleStatus(ids) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Toggle Status', { method: 'put', url: baseURL + '/toggle', data: { set: ids } });
    return res.status;
  },

  async resolved(ids) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Resolve', { method: 'put', url: baseURL + '/resolved', data: { set: ids } });
    return res.status;
  }

};
