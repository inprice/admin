import Helper from './helper';

const baseURL = '/membership';

export default {

  async list() {
    const res = await Helper.call('Members', { method: 'get', url: baseURL });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async send(form) {
    const res = await Helper.call('Add Member', { method: 'post', url: baseURL, data: form });
    return res.status;
  },

  async resend(id) {
    const res = await Helper.call('Invite again', { method: 'post', url: baseURL + '/' + id });
    return res.status;
  },

  async changeRole(data) {
    const res = await Helper.call('Change Role', { method: 'put', url: baseURL + '/change-role', data });
    return res.status;
  },

  async updateStatus(data) {
    const res = await Helper.call('Update Status', { method: 'put', url: baseURL + '/update-status', data });
    return res.status;
  },

};
