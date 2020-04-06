import ApiService from './api';
import Helper from './helper';
import SessionService from './session';

import router from '../router';
import Utility from '../helpers/utility';

export default {

  async login(form) {
    const res = await Helper.call('Login', { url: '/login', data: form });
    if (res.status == true) ApiService.saveSessionInfo(res.data);
    return res.status;
  },

  async requestRegistration(form) {
    const res = await Helper.call('Registration Request', { url: '/request-registration', data: form });
    if (res.status == true) router.push('/complete-registration');
    return res.status;
  },

  async completeRegistration(code) {
    const res = await Helper.call('Registration Complete', { url: '/complete-registration?token=' + code });
    if (res.status == true) ApiService.saveSessionInfo(res.data);
    return res.status;
  },

  async forgotPassword(email) {
    const res = await Helper.call('Forgot Password', { url: '/forgot-password', data: { email } });
    return res.status;
  },

  async resetPassword(form) {
    const res = await Helper.call('Reset Password', { url: '/reset-password', data: form });
    return res.status;
  },

  async acceptInvitation(form) {
    const res = await Helper.call('Accept Invitation', { url: '/reset-password', data: form });
    return res.status;
  },

  logout(expired) {
    ApiService.post('/logout', { email: SessionService.getUserEmail() })
      .then(() => {
        ApiService.removeSessionInfo();
        if (expired == false) Utility.showShortInfoMessage('Logout', 'You have been successfully logged out!');
        router.push('/login' + (expired == true ? '?m=1nqq' : ''));
    });
  }

};
