import Helper from './helper';
import store from '../store';

const baseURL = '/link';

export default {

  async list(productId) {
    const res = await Helper.call('Link List', { method: 'get', url: baseURL + 's/' + productId });
    if (res.status) return res.data;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Link Search', { url: baseURL + 's/search', data: form });
    if (res.status) return res.data;
    return null;
  },

  async remove(ids, from_product_id=null) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Link Delete', { method: 'delete', url: baseURL, data: { fromProductId: from_product_id, linkIdSet: ids } });
    return res;
  },

  async moveTo(form) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Link Move', { url: baseURL + '/move', data: form });
    return res;
  },

  async getDetails(id) {
    const res = await Helper.call('Get Details', { method: 'get', url: baseURL + '/details/' + id });
    if (res.status == true) return res;
    return null;
  },

  async toggleStatus(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Toggle Status', { method: 'put', url: baseURL + '/toggle/' + id });
    return res.status;
  },

};
