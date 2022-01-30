import Helper from './helper';
import store from '../store';

const baseURL = '/voucher';

export default {

  getVouchers() {
    return Helper.call('Vouchers', { method: 'get', url: baseURL }, true);
  },

  async applyVoucher(code) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'Vouchers can be applied only by admin!' });
      return;
    }

    const res = await Helper.call('Apply Voucher', { method: 'put', url: baseURL + '/apply/' + code });
    return res;
  },

};
