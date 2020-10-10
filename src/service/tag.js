import Helper from './helper';

const baseURL = '/tag/product';

export default {

  async getAll() {
    const res = await Helper.call('Tags', { method: 'get', url: baseURL });
    return res;
  },

};
