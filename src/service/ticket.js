import Helper from './helper';
import store from '../store';

const baseURL = '/ticket';

export default {

  async get(id) {
    const res = await Helper.call('Find Ticket', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async search(form) {
    const res = await Helper.call('Search Ticket', { url: baseURL + 's/search', data: form });
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

    const res = await Helper.call('Save Ticket', { method, url: baseURL, data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: `Your ${form.type} about ${form.subject} has been successfully ${opType}` });
    return res;
  },

  async remove(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Delete Ticket', { method: 'delete', url: baseURL + '/' + id });
    return res;
  },

  async toggleSeenValue(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Toggle Seen', { method: 'put', url: baseURL + '/seen/' + id });
    return res;
  },

  async saveComment(form) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    let method = 'post';
    if (form.id && form.id > 0) {
      method = 'put';
    }

    const res = await Helper.call('Save Comment', { method, url: baseURL, data: form });
    return res;
  },

  async removeComment(id) {
    if (store.get('session/isNotEditor')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Delete Comment', { method: 'delete', url: baseURL + '/comment/' + id });
    return res;
  }

};
