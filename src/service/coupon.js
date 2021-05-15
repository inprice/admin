import Helper from './helper';
import store from '../store';

const baseURL = '/coupon';

export default {

  getCoupons() {
    return Helper.call('Coupons', { method: 'get', url: baseURL }, false);
  },

  async applyCoupon(code) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'Coupons can be applied only by admin!' });
      return;
    }

    const res = await Helper.call('Apply Coupon', { method: 'put', url: baseURL + '/apply/' + code });
    return res;
  },

};
