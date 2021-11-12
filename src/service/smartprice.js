import Helper from './helper';
import store from '../store';

const baseURL = '/smart-price';

export default {

  async get(id) {
    const res = await Helper.call('Find Smart Price', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async getList() {
    const res = await Helper.call('Smart Price List', { method: 'get', url: baseURL + 's' }, true);
    if (res.status == true) return res;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Search Smart Price', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async save(form) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Save Smart Price', { method: (form.id && form.id > 0 ? 'put' : 'post'), url: baseURL, data: form });
    return res;
  },

  async test(form) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Test Smart Price', { url: baseURL + '/test', data: form }, true);
    return res;
  },

  async remove(id) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Delete Smart Price', { method: 'delete', url: baseURL + '/' + id });
    return res;
  },

};
