import Helper from './helper';
import store from '../store';

const baseURL = '/account';

export default {

  async get() {
    const res = await Helper.call('Account', { method: 'get', url: baseURL });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async create(form) {
    if (store.get('session/isSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'Super users are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Create Account', { method: 'post', url: baseURL, data: form });
    return res && res.status;
  },

  async update(form) {
    if (store.get('session/isSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'Super users are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Update Account', { method: 'put', url: baseURL, data: form });
    return res.status;
  },

  async deleteAccount(password) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'Accounts can be deleted only by admin!' });
      return;
    }

    const res = await Helper.call('Delete Account', { method: 'delete', url: baseURL, data: { value: password }});
    return res.status;
  }

};
