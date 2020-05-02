import Helper from './helper';

const baseURL = '/link';

export default {

  async save(form) {
    let method = 'post';
    if (form.id && form.id > 0) method = 'put';

    const res = await Helper.call('Link Save', { method, url: baseURL, data: form });
    return res.status;
  },

  async list(prodId) {
    const res = await Helper.call('Link List', { method: 'get', url: baseURL + 's/' + prodId }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async remove(id) {
    const res = await Helper.call('Link Delete', { method: 'delete', url: baseURL + '/' + id });
    return res.status;
  }

};
