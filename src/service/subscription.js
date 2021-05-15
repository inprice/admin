import Helper from './helper';
import store from '../store';

const baseURL = '/subscription';

export default {

  async saveInfo(form) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'You must be admin to save your info!' });
      return;
    }

    const res = await Helper.call('Subs Info', { url: baseURL + '/save-info', data: form });
    return res.status;
  },

  getInfo() {
    return Helper.call('Subs Info', { method: 'get', url: baseURL + '/get-info' }, false, false);
  },

  async cancel() {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'You must be admin to cancel your subscription!' });
      return;
    }

    const res = await Helper.call('Cancel Subscription', { method: 'put', url: baseURL + '/cancel' });
    return res;
  },

  async startFreeUse() {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'You must be admin to start your free use!' });
      return;
    }

    const res = await Helper.call('Free Use', { method: 'post', url: baseURL + '/free-use' });
    return res;
  },

  async createCheckout(planId) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'You must be admin to make a payment!' });
      return;
    }

    const res = await Helper.call('Create Checkout', { url: baseURL + '/create-checkout/' + planId });
    return res;
  },

  async changeTo(planId) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'You must be admin to change your plan!' });
      return;
    }

    const res = await Helper.call('Change Plan', { method: 'put', url: baseURL + '/change-plan/' + planId });
    return res;
  },

  cancelCheckout(hash) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'You must be admin to cancel your payment checkout!' });
      return;
    }

    return Helper.call('Cancel Checkout', { method: 'post', url: baseURL + '/cancel-checkout/' + hash });
  },

};
