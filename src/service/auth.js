import Helper from './helper';
import store from '../store'

export default {

  async requestRegistration(form) {
    const res = await Helper.call('Registration Request', { url: '/request-registration', data: form }, true);
    return res;
  },

  async completeRegistration(code) {
    const res = await Helper.call('Registration Complete', { url: '/complete-registration?token=' + code }, true);
    if (res.status == true) store.dispatch('session/create', res);
    return res;
  },

  async acceptInvitation(form) {
    const res = await Helper.call('Accept Invitation', { url: '/accept-invitation', data: form }, true);
    if (res.status == true) store.dispatch('session/create', res);
    return res;
  },

  async forgotPassword(email) {
    const res = await Helper.call('Forgot Password', { url: '/forgot-password', data: { email } }, true);
    return (res && res.status);
  },

  async resetPassword(form) {
    const res = await Helper.call('Reset Password', { url: '/reset-password', data: form }, true);
    return res;
  }

};
