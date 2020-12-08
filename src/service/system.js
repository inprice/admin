import Helper from './helper';

const baseURL = '/app';

export default {

  async fetchPlans() {
    const res = await Helper.call('Plans', { method: 'get', url: baseURL + '/plans' });
    return res;
  },

  refreshSession() {
    return Helper.call('Plans', { method: 'get', url: baseURL + '/refresh-session' }, false);
  },

};
