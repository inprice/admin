import Helper from './helper';

const baseURL = '/subscription';

export default {

  getInfo() {
    return Helper.call('Invoice Info', { method: 'get', url: baseURL }, false);
  },

  async saveInfo(form) {
    const res = await Helper.call('Invoice Info', { url: baseURL + '/save-info', data: form });
    return res.status;
  },

  async cancel() {
    const res = await Helper.call('Cancel Subscription', { method: 'put', url: baseURL + '/cancel' });
    return res;
  },

  getTransactions() {
    return Helper.call('Transactions', { method: 'get', url: baseURL + '/trans' }, false);
  },

  async startFreeUse() {
    const res = await Helper.call('Free Use', { method: 'post', url: baseURL + '/free-use' });
    return res;
  },

  async createCheckout(planId) {
    const res = await Helper.call('Create Checkout', { url: baseURL + '/create-checkout/' + planId });
    return res;
  },

  async changeTo(planId) {
    const res = await Helper.call('Change Plan', { method: 'put', url: baseURL + '/change-plan/' + planId });
    return res;
  },

  cancelCheckout(hash) {
    return Helper.call('Cancel Checkout', { method: 'post', url: baseURL + '/cancel-checkout/' + hash });
  },

};
