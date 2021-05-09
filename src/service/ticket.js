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
    if (res.status == true) store.commit('snackbar/setMessage', { text: `${form.name} has been successfully ${opType}` });
    return res;
  },

  async search(term) {
    const res = await Helper.call('Search Ticket', { method: 'get', url: baseURL + 's/search/?term=' + term });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async markAsRead(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Mark As Read', { method: 'put', url: baseURL + '/mark-as-read/' + id });
    return res.status;
  },

  async markAllAsRead(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Mark As Read', { method: 'put', url: baseURL + '/mark-all-as-read' });
    return res.status;
  },

  async remove(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Ticket Delete', { method: 'delete', url: baseURL + '/' + id });
    return res;
  }

};
