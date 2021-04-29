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

};
