import Helper from './helper';
import store from '../store';

const baseURL = '/def/brand';

export default {

  async getList() {
    const res = await Helper.call('Brand List', { method: 'get', url: baseURL + '/list' }, true);
    if (res.status == true) return res;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Search Brand', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async save(form) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Save Brand', { method: (form.id && form.id > 0 ? 'put' : 'post'), url: baseURL, data: form });
    return res;
  },

  async remove(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Delete Brand', { method: 'delete', url: baseURL + '/' + id });
    return res;
  },

};
