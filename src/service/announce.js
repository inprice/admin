import Helper from './helper';

const baseURL = '/announce';

export default {

  async search(form) {
    const res = await Helper.call('Search Announces', { url: baseURL + 's/search', data: form });
    if (res.status) return res.data;
    return null;
  },

  markAllAsRead() {
    return Helper.call('Clear Announces', { method: 'put', url: baseURL });
  },

};
