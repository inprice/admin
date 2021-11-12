import Helper from './helper';
import store from '../store';

const baseURL = '/alarm';

export default {

  async save(form) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    form.topic = form.topic.toUpperCase();

    const res = await Helper.call('Save Alarm', { method: (form.id && form.id > 0 ? 'put' : 'post'), url: baseURL, data: form });
    return res;
  },

  async remove(id) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to delete any data!' });
      return;
    }

    const res = await Helper.call('Delete Alarm', { method: 'delete', url: baseURL + '/' + id });
    return res;
  },

};
