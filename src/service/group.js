import Helper from './helper';
import store from '../store';

const baseURL = '/group';

export default {

  async get(id) {
    const res = await Helper.call('Find Group', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async getLinks(id) {
    const res = await Helper.call('Find Groups', { method: 'get', url: baseURL + '/links/' + id });
    return res;
  },

  async save(form) {
    if (store.get('session/isViewer')) return;

    let method = 'post', opType = 'added';
    if (form.id && form.id > 0) {
      method = 'put'; opType = 'edited';
    }

    const res = await Helper.call('Group Save', { method, url: baseURL, data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: `${form.name} has been successfully ${opType}` });
    return res.status;
  },

  async search(term) {
    const res = await Helper.call('Group Search', { method: 'get', url: baseURL + 's/search/?term=' + term });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async toggle(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Group Toggle', { method: 'put', url: baseURL + '/toggle/' + id });
    return res.status;
  },

  async remove(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Group Delete', { method: 'delete', url: baseURL + '/' + id });
    return res.status;
  }

};
