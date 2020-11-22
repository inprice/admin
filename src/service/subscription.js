import Helper from './helper';

const baseURL = '/subscription';
const couponBaseURL = '/coupon';

export default {

  async getInfo() {
    const res = await Helper.call('Invoice Info', { method: 'get', url: baseURL }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async saveInfo(form) {
    const res = await Helper.call('Invoice Info', { url: baseURL + '/save-info', data: form });
    return res.status;
  },

  async createSession(planId) {
    const res = await Helper.call('Create Session', { url: baseURL + '/create-session/' + planId });
    return res;
  },

  async cancel() {
    const res = await Helper.call('Cancel Subscription', { method: 'put', url: baseURL + '/cancel' });
    return res;
  },

  getTransactions() {
    return Helper.call('Transactions', { method: 'get', url: baseURL + '/trans' }, false);
  },

  getCoupons() {
    return Helper.call('Coupons', { method: 'get', url: couponBaseURL }, false);
  },

  async startFreeUse() {
    const res = await Helper.call('Free Use', { method: 'post', url: baseURL + '/free-use' });
    return res;
  },

};
