import Helper from './helper';
import store from '../store';

const baseURL = '/subscription';

export default {

  getInfo() {
    return Helper.call('Invoice Info', { method: 'get', url: baseURL }, false);
  },

  async saveInfo(form) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Invoice Info', { url: baseURL + '/save-info', data: form });
    return res.status;
  },

  async cancel() {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Cancel Subscription', { method: 'put', url: baseURL + '/cancel' });
    return res;
  },

  getTransactions() {
    return Helper.call('Transactions', { method: 'get', url: baseURL + '/trans' }, false);
  },

  async startFreeUse() {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Free Use', { method: 'post', url: baseURL + '/free-use' });
    return res;
  },

  async createCheckout(planId) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Create Checkout', { url: baseURL + '/create-checkout/' + planId });
    return res;
  },

  async changeTo(planId) {
    if (store.get('session/isNotAdmin')) return;

    const res = await Helper.call('Change Plan', { method: 'put', url: baseURL + '/change-plan/' + planId });
    return res;
  },

  cancelCheckout(hash) {
    if (store.get('session/isNotAdmin')) return;

    return Helper.call('Cancel Checkout', { method: 'post', url: baseURL + '/cancel-checkout/' + hash });
  },

};
