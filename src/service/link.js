import Helper from './helper';
import store from '../store';

const baseURL = '/link';

export default {

  async insert(data) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Link Save', { method: 'post', url: baseURL, data });
    return res;
  },

  async list(prodId) {
    const res = await Helper.call('Link List', { method: 'get', url: baseURL + 's/' + prodId }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Link Search', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async remove(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Link Delete', { method: 'delete', url: baseURL + '/' + id });
    return res.status;
  },

  async getDetails(id) {
    const res = await Helper.call('Get Details', { method: 'get', url: baseURL + '/details/' + id });
    if (res.status == true) return res;
    return null;
  },

  async toggleStatus(id) {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Toggle Status', { method: 'put', url: baseURL + '/toggle/' + id });
    return res.status;
  }

};
