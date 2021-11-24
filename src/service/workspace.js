import Helper from './helper';
import store from '../store';

const baseURL = '/workspace';

export default {

  async get() {
    const res = await Helper.call('Workspace', { method: 'get', url: baseURL });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async create(form) {
    if (store.get('session/isSuperUser') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: Helper.NOT_ALLOWED() });
      return;
    }

    const res = await Helper.call('Create Workspace', { method: 'post', url: baseURL, data: form });
    return res && res.status;
  },

  async update(form) {
    if (store.get('session/isSuperUser') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: Helper.NOT_ALLOWED() });
      return;
    }

    const res = await Helper.call('Update Workspace', { method: 'put', url: baseURL, data: form });
    return res.status;
  },

  async deleteWorkspace(password) {
    if (store.get('session/isNotAdmin') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: 'Workspaces can be deleted only by admin!' });
      return;
    }

    const res = await Helper.call('Delete Workspace', { method: 'delete', url: baseURL, data: { value: password }});
    return res.status;
  }

};
