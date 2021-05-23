import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/account';

export default {

  async search(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Search Account', { url: baseURL + 's/search', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  fetchDetails(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Details', { method: 'get', url: baseURL + '/' + id });
  },

  async bind(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Bind Account', { method: 'put', url: baseURL + '/bind/' + id });
    return res;
  },

  async createCoupon(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Create Coupon', { url: baseURL + '/coupon', data: form });
    return res;
  },

};
