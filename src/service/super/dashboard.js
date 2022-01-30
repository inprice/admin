import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/dashboard';

export default {

  async getReport() {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Dashboard', { method: 'get', url: baseURL });
    if (res.status == true && res.data) return res;
    return {};
  },

  async refresh() {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Dashboard', { method: 'get', url: baseURL + '/refresh' });
    if (res.status == true && res.data) return res;
    return {};
  }

};
