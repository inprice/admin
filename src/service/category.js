import Helper from './helper';
import store from '../store';

const baseURL = '/def/category';

export default {

  async list() {
    const res = await Helper.call('Category List', { method: 'get', url: baseURL + '/list' }, true);
    if (res.status == true) return res;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Search Category', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async save(form) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Save Category', { method: (form.id && form.id > 0 ? 'put' : 'post'), url: baseURL, data: form });
    return res;
  },

  async remove(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Delete Alarm', { method: 'delete', url: baseURL + '/' + id });
    return res;
  },

};
