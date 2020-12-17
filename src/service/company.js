import Helper from './helper';

const baseURL = '/company';

export default {

  async get() {
    const res = await Helper.call('Company', { method: 'get', url: baseURL });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async create(form) {
    const res = await Helper.call('Create Company', { method: 'post', url: baseURL, data: form });
    return res && res.status;
  },

  async update(form) {
    const res = await Helper.call('Update Company', { method: 'put', url: baseURL, data: form });
    return res.status;
  },

  async deleteCompany(password) {
    const res = await Helper.call('Delete Company', { method: 'put', url: baseURL + '/delete', data: { value: password }});
    return res.status;
  }

};
