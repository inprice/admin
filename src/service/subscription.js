import Helper from './helper';

const baseURL = '/subscription';

export default {

  async cancel() {
    const res = await Helper.call('Cancel Subscription', { method: 'put', url: baseURL + '/cancel' });
    return res;
  },

  getTransactions() {
    return Helper.call('Transactions', { method: 'get', url: baseURL + '/trans' }, false);
  },

};
