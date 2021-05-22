import Helper from './helper';
import store from '../store';

const baseURL = '/link';

export default {

  async list(groupId) {
    const res = await Helper.call('Link List', { method: 'get', url: baseURL + 's/' + groupId });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Link Search', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async remove(ids, from_group_id=null) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Link Delete', { method: 'delete', url: baseURL, data: { fromGroupId: from_group_id, linkIdSet: ids } });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async moveTo(form) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Link Move', { url: baseURL + '/move', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
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
  }

};
