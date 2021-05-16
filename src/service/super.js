import Helper from './helper';
import store from '../store';

const baseURL = '/sys';

export default {

  async searchAccount(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Search Account', { url: baseURL + '/account', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async bindAccount(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Bind Account', { method: 'put', url: baseURL + '/account/bind/' + id });
    return res;
  },

  async unbindAccount() {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('UnBind Account', { url: baseURL + '/account/unbind' });
    return res;
  },

  async createCoupon(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Create Coupon', { url: baseURL + '/account/coupon', data: form });
    return res;
  },

};
