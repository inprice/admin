import Helper from './helper';
import store from '../store'

export default {

  async requestRegistration(form) {
    if (store.get('session/isSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'Super users are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Registration Request', { url: '/request-registration', data: form });
    return res.status;
  },

  async completeRegistration(code) {
    if (store.get('session/isSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'Super users are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Registration Complete', { url: '/complete-registration?token=' + code });
    if (res.status == true) store.dispatch('session/create', res);
    return res.status;
  },

  async acceptInvitation(form) {
    if (store.get('session/isSuperUser')) {
      store.commit('snackbar/setMessage', { text: 'Super users are not allowed to edit any data!' });
      return;
    }

    const res = await Helper.call('Accept Invitation', { url: '/accept-invitation', data: form });
    if (res.status == true) store.dispatch('session/create', res);
    return res.status;
  },

  async forgotPassword(email) {
    const res = await Helper.call('Forgot Password', { url: '/forgot-password', data: { email } });
    return res.status;
  },

  async resetPassword(form) {
    const res = await Helper.call('Reset Password', { url: '/reset-password', data: form });
    return res.status;
  }

};
