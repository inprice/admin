import Helper from './helper';
import store from '../store';

const baseURL = '/announce';

export default {

  async search(form) {
    const res = await Helper.call('Search Announces', { url: baseURL + 's/search', data: form });
    if (res.status) return res.data;
    return null;
  },

  markAllAsRead() {
    if (store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    return Helper.call('Clear Announces', { method: 'put', url: baseURL });
  },

};
