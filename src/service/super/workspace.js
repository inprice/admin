import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/workspace';

export default {

  async search(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Search Workspace', { url: baseURL + 's/search', data: form });
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

  fetchDetails(workspaceId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Details', { method: 'get', url: baseURL + '/details/' + workspaceId });
  },

  fetchMemberList(workspaceId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Members', { method: 'get', url: baseURL + '/details/members/' + workspaceId });
  },

  fetchUserList(workspaceId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Workspace Users', { method: 'get', url: baseURL + '/users/' + workspaceId });
  },

  fetchHistoryList(workspaceId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch History', { method: 'get', url: baseURL + '/details/history/' + workspaceId });
  },

  fetchTransactionList(workspaceId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Transactions', { method: 'get', url: baseURL + '/details/transactions/' + workspaceId });
  },

  async bind(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Bind Workspace', { method: 'put', url: baseURL + '/bind/' + id });
    return res;
  },

  async createVoucher(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Create Voucher', { url: baseURL + '/voucher', data: form });
    return res;
  },

  async getIdNameList(term) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Workspace List', { url: baseURL + '/id-name-pairs?term=' + term });
    if (res.status == true && res.data) return res;
    return null;
  },

};
