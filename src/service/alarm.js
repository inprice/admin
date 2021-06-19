import Helper from './helper';
import store from '../store';

const baseURL = '/alarm';

export default {

  async search(form) {
    const res = await Helper.call('Search Alarm', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async save(form) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    let method = 'post', opType = 'added';
    if (form.id && form.id > 0) {
      method = 'put'; opType = 'edited';
    }

    const res = await Helper.call('Save Alarm', { method, url: baseURL, data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: `Your alarm has been successfully ${opType}` });
    return res;
  },

  async remove(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Delete Alarm', { method: 'delete', url: baseURL + '/' + id });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'Your alarm has been successfully removed' });
    return res;
  },

};
