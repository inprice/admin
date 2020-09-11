import Helper from './helper';

const baseURL = '/competitor';

export default {

  async insert(data) {
    const res = await Helper.call('Competitor Save', { method: 'post', url: baseURL, data });
    return res;
  },

  async list(prodId) {
    const res = await Helper.call('Competitor List', { method: 'get', url: baseURL + 's/' + prodId }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async search(form) {
    const res = await Helper.call('Competitor Search', { method: 'get', url: baseURL + '/search' + Helper.toQueryString(form) });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async remove(id) {
    const res = await Helper.call('Competitor Delete', { method: 'delete', url: baseURL + '/' + id });
    return res.status;
  },

  async changeStatus(id, status) {
    const res = await Helper.call('Change Status', { method: 'put', url: baseURL + '/' + status.toLowerCase() + '/' + id });
    return res.status;
  }

};
