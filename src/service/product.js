import Helper from './helper';
import store from '../store';

const baseURL = '/product';

export default {

  async get(id) {
    const res = await Helper.call('Find Product', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async getLinks(id) {
    const res = await Helper.call('Find Product', { method: 'get', url: baseURL + '/links/' + id });
    return res;
  },

  async save(form) {
    if (store.get('session/isViewer')) return;

    let method = 'post', opType = 'added';
    if (form.id && form.id > 0) {
      method = 'put'; opType = 'edited';
    }

    const res = await Helper.call('Product Save', { method, url: baseURL, data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: `${form.name} has been successfully ${opType}` });
    return res.status;
  },

  async search(data, isFullSearch=false) {
    const params = { url: baseURL + 's/search' };
    if (isFullSearch == true) {
      params.data = data;
    } else {
      params.url += '?term=' + data;
    }
    const res = await Helper.call('Product Search', params);
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async toggle(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Product Toggle', { method: 'put', url: baseURL + '/toggle/' + id });
    return res.status;
  },

  async remove(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Product Delete', { method: 'delete', url: baseURL + '/' + id });
    return res.status;
  }

};
