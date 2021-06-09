import Helper from './helper';

const baseURL = '/announce';

export default {

  async search(form) {
    const res = await Helper.call('Search Announce', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

};
