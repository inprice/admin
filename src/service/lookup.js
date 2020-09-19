import Helper from './helper';

const baseURL = '/lookup';

export default {

  async add(form) {
    const res = await Helper.call(form.type + ' Save', { method: 'post', url: baseURL, data: form });
    return res;
  },

  async getAllList() {
    const res = await Helper.call('Lookup List', { method: 'get', url: baseURL + '/all' });
    return res;
  },

};
