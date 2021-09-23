import Helper from './helper';
import store from '../store';

const baseURL = '/credit';

export default {

  getCredits() {
    return Helper.call('Credits', { method: 'get', url: baseURL }, true);
  },

  async applyCredit(code) {
    if (store.get('session/isNotAdmin')) {
      store.commit('snackbar/setMessage', { text: 'Credits can be applied only by admin!' });
      return;
    }

    const res = await Helper.call('Apply Credit', { method: 'put', url: baseURL + '/apply/' + code });
    return res;
  },

};
