import Helper from './helper';
import store from '../store';

const baseURL = '/product';

export default {

  async get(id) {
    const res = await Helper.call('Find Product', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async getLinks(id) {
    const res = await Helper.call('Find Products', { method: 'get', url: baseURL + '/links/' + id });
    return res;
  },

  async save(form) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    let method = 'post', opType = 'added';
    if (form.id && form.id > 0) {
      method = 'put'; opType = 'edited';
    }

    const res = await Helper.call('Product Save', { method, url: baseURL, data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: `${form.name} has been successfully ${opType}` });
    return res;
  },

  async insertLinks(productId, linksText) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    const res = await Helper.call('Add Links', { url: baseURL + '/add-links', data: { productId, linksText } });
    return res;
  },

  async getIdNameList(excludedId) {
    const res = await Helper.call('Product List', { method: 'get', url: baseURL + '/pairs/' + (excludedId ? excludedId : 0) });
    if (res.status == true && res.data) return res;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Product Search', { url: baseURL + 's/search', data: form });
    if (res.status) return res.data;
    return null;
  },

  async toggle(id) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    const res = await Helper.call('Product Toggle', { method: 'put', url: baseURL + '/toggle/' + id });
    return res.status;
  },

  async remove(id) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    const res = await Helper.call('Product Delete', { method: 'delete', url: baseURL + '/' + id });
    return res;
  },

  async setAlarmON(form) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    const res = await Helper.call('Set Alarm On', { method: 'put', url: baseURL + '/alarm/on', data: form });
    return res;
  },

  async setAlarmOFF(form) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    const res = await Helper.call('Set Alarm Off', { method: 'put', url: baseURL + '/alarm/off', data: form });
    return res;
  },

};
