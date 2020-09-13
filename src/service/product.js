import Helper from './helper';
import Utility from '@/helpers/utility';

const baseURL = '/product';

export default {

  async get(id) {
    const res = await Helper.call('Find Product', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async save(form) {
    let method = 'post', opType = 'added';
    if (form.id && form.id > 0) {
      method = 'put'; opType = 'edited';
    }

    const res = await Helper.call('Product Save', { method, url: baseURL, data: form });
    if (res.status == true) Utility.showInfoMessage('Product', form.name + ' has been successfully ' + opType)
    return res.status;
  },

  async search(form) {
    const res = await Helper.call('Product Search', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async toggle(id) {
    const res = await Helper.call('Product Toggle', { method: 'put', url: baseURL + '/toggle/' + id });
    return res.status;
  },

  async remove(id) {
    const res = await Helper.call('Product Delete', { method: 'delete', url: baseURL + '/' + id });
    return res.status;
  }

};
