import Helper from './helper';
import store from '../store';

const baseURL = '/member';

export default {

  async list() {
    if (store.get('session/isViewer')) return;

    const res = await Helper.call('Members', { method: 'get', url: baseURL }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async send(form) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Add Member', { method: 'post', url: baseURL, data: form });
    return res.status;
  },

  async resend(id) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Invite again', { method: 'post', url: baseURL + '/' + id });
    return res.status;
  },

  async changeRole(data) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Change Role', { method: 'put', url: baseURL + '/change-role', data });
    return res.status;
  },

  async remove(id) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Delete Member', { method: 'delete', url: baseURL + '/delete/' + id });
    return res.status;
  },

  async pause(id) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Pause Member', { method: 'put', url: baseURL + '/pause/' + id });
    return res.status;
  },

  async resume(id) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Resume Member', { method: 'put', url: baseURL + '/resume/' + id });
    return res.status;
  },

};
