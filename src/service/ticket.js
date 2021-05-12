import Helper from './helper';
import store from '../store';

const baseURL = '/ticket';

export default {

  async get(id) {
    const res = await Helper.call('Find Ticket', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async save(form) {
    if (store.get('session/isViewer')) return;

    let method = 'post', opType = 'added';
    if (form.id && form.id > 0) {
      method = 'put'; opType = 'edited';
    }

    const res = await Helper.call('Save Ticket', { method, url: baseURL, data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: `Your ${form.type} about ${form.subject} has been successfully ${opType}` });
    return res;
  },

  async search(form) {
    const res = await Helper.call('Search Ticket', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async remove(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Ticket Delete', { method: 'delete', url: baseURL + '/' + id });
    return res;
  }

};
