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

  async searchForLogs(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Search Log', { url: baseURL + '/search-logs', data: form });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  fetchDetails(accountId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Details', { method: 'get', url: baseURL + '/details/' + accountId });
  },

  fetchMemberList(accountId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Members', { method: 'get', url: baseURL + '/details/members/' + accountId });
  },

  fetchUserList(accountId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Account Users', { method: 'get', url: baseURL + '/users/' + accountId });
  },

  fetchHistoryList(accountId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch History', { method: 'get', url: baseURL + '/details/history/' + accountId });
  },

  fetchTransactionList(accountId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Transactions', { method: 'get', url: baseURL + '/details/transactions/' + accountId });
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

  async getIdNameList(term) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Account List', { url: baseURL + '/id-name-pairs?term=' + term });
    if (res.status == true && res.data) return res;
    return null;
  },

};
