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

  async search(term) {
    const res = await Helper.call('Alarm Search', { url: baseURL + 's/search?term=' + term });
    if (res.status) return res.data;
    return null;
  },

  async getDetails(id) {
    const res = await Helper.call('Get Details', { method: 'get', url: baseURL + '/details/' + id });
    if (res.status == true) return res;
    return null;
  },

  async getIdNameList(topic) {
    const res = await Helper.call('Alarm List', { method: 'get', url: baseURL + '/pairs?topic=' + topic });
    if (res.status == true && res.data) return res;
    return null;
  },

  async setAlarmOFF(form) {
    if (store.get('session/isNotEditor') || store.get('session/isDemoUser')) {
      store.commit('snackbar/setMessage', { text: 'You are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Set Alarm Off', { method: 'put', url: baseURL + '/off', data: form });
    return res;
  },

};
