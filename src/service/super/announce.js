import Helper from '../helper';
import store from '../../store';

const baseURL = '/sys/announce';

export default {

  async search(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Search Announce', { url: baseURL + 's/search', data: form });
    if (res.status) return res.data;
    return null;
  },

  async save(form) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    let method = 'post';
    if (form.id && form.id > 0) {
      method = 'put';
    }

    const res = await Helper.call('Save Announce', { method, url: baseURL, data: form });
    return res;
  },

  async remove(id) {
    if (store.get('session/isNotSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'You must be a super user!' });
      return;
    }

    const res = await Helper.call('Delete Announce', { method: 'delete', url: baseURL + '/' + id });
    return res;
  }

};
