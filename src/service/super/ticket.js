import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/ticket';

export default {

  async get(id) {
    const res = await Helper.call('Find Ticket', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async search(form) {
    const res = await Helper.call('Search Ticket', { url: baseURL + 's/search', data: form });
    if (res.status) return res.data;
    return null;
  },

  async changeStatus(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Change Status', { method: 'put', url: baseURL + '/change-status', data: form });
    return res;
  },

  async toggleSeenValue(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Toggle Seen', { method: 'put', url: baseURL + '/seen/' + id });
    return res;
  },

  async saveComment(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    let method = 'post';
    if (form.id && form.id > 0) {
      method = 'put';
    }

    const res = await Helper.call('Save Comment', { method, url: baseURL + '/comment', data: form });
    return res;
  },

  async removeComment(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Delete Comment', { method: 'delete', url: baseURL + '/comment/' + id });
    return res;
  }

};
