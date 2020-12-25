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
    const res = await Helper.call('Create Account', { method: 'post', url: baseURL, data: form });
    return res && res.status;
  },

  async update(form) {
    const res = await Helper.call('Update Account', { method: 'put', url: baseURL, data: form });
    return res.status;
  },

  async deleteAccount(password) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Delete Account', { method: 'put', url: baseURL + '/delete', data: { value: password }});
    return res.status;
  }

};
