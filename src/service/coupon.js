import Helper from './helper';

const baseURL = '/coupon';

export default {

  getCoupons() {
    return Helper.call('Coupons', { method: 'get', url: baseURL }, false);
  },

  async applyCoupon(code) {
    const res = await Helper.call('Apply Coupon', { method: 'put', url: baseURL + '/apply/' + code });
    return res;
  },

};
