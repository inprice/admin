import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/user';

export default {

  async search(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Search User', { url: baseURL + 's/search', data: form });
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

  async ban(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Ban User', { url: baseURL + '/ban', data: form });
    return res;
  },

  async revokeBan(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    const res = await Helper.call('Revoke Ban', { method: 'put', url: baseURL + '/ban-revoke/' + id });
    return res;
  },

  fetchUserDetails(userId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Details', { method: 'get', url: baseURL + '/details/' + userId });
  },

  fetchMembershipList(userId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Memberships', { method: 'get', url: baseURL + '/details/memberships/' + userId });
  },

  fetchSessionList(userId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Sessions', { method: 'get', url: baseURL + '/details/sessions/' + userId });
  },

  fetchUsedServices(userId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch Used Services', { method: 'get', url: baseURL + '/used-services/' + userId });
  },

  fetchAccountList(userId) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Fetch User Accounts', { method: 'get', url: baseURL + '/accounts/' + userId });
  },

  terminateSession(hash) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Terminate Session', { method: 'delete', url: baseURL + '/session/terminate/' + hash });
  },

  deleteUsedService(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Delete Used Services', { method: 'delete', url: baseURL + '/used-service/' + id });
  },

  toggleUnlimitUsedService(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be super user!' });
      return;
    }

    return Helper.call('Unlimit Used Services', { method: 'put', url: baseURL + '/used-service/toggle/' + id });
  },

};
