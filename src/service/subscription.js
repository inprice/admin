import Helper from './helper';

const baseURL = '/subs';

export default {

  async getCoupons() {
    const res = await Helper.call('Company Coupons', { method: 'get', url: baseURL + '/coupons' }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async cancel() {
    const res = await Helper.call('Cancel Subscription', { method: 'put', url: baseURL + '/cancel' });
    return res;
  },

  getTransactions() {
    return Helper.call('Transactions', { method: 'get', url: baseURL + '/trans' }, false);
  },

  async applyCoupon(code) {
    const res = await Helper.call('Apply Coupon', { method: 'put', url: baseURL + '/apply-coupon/' + code });
    return res;
  },

};
