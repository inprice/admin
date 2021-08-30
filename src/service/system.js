import Helper from './helper';

const baseURL = '/app';

export default {

  async fetchPlans() {
    const res = await Helper.call('Plans', { method: 'get', url: baseURL + '/plans' });
    return res;
  },

  async getStatistics() {
    const res = await Helper.call('Statistics', { method: 'get', url: baseURL + '/statistics' });
    return res;
  },

  async search(term) {
    const res = await Helper.call('Search', { method: 'get', url: baseURL + '/search?term=' + term }, true);
    if (res.status == true && res.data) return res;
    return null;
  },

};
