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
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to save any data!' });
      return;
    }

    let method = 'post', opType = 'added';
    if (form.id && form.id > 0) {
      method = 'put'; opType = 'edited';
    }

    const res = await Helper.call('Group Save', { method, url: baseURL, data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: `${form.name} has been successfully ${opType}` });
    return res;
  },

  async insertLinks(groupId, linksText) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to insert any data!' });
      return;
    }

    const res = await Helper.call('Add Links', { url: baseURL + '/add-links', data: { groupId, linksText } });
    return res;
  },

  async getIdNameList(excludedId) {
    const res = await Helper.call('Group List', { method: 'get', url: baseURL + '/pairs/' + (excludedId ? excludedId : 0) });
    if (res.status == true && res.data) return res;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Group Search', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async toggle(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Group Toggle', { method: 'put', url: baseURL + '/toggle/' + id });
    return res.status;
  },

  async remove(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Group Delete', { method: 'delete', url: baseURL + '/' + id });
    return res;
  }

};
