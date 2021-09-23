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
    if (res.status) return res.data;
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

  async changeStatus(ids, newStatus) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Resolve', { method: 'put', url: baseURL + '/change-status', data: { idSet: ids, status: newStatus } });
    return res.status;
  },

  async undo(ids) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Undo', { method: 'put', url: baseURL + '/undo', data: { idSet: ids } });
    return res.status;
  }

};
