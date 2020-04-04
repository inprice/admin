import router from '../router';
import Utility from '../helpers/utility';

import ApiService from './api-service';
import SessionService from './session-service';

const saveSessionInfo = (res) => {
  const info = {
    access: res.ACCESS,
    refresh: res.REFRESH,
    user: res.user
  };
  SessionService.saveSessionInfo(info);
  ApiService.setHeader(info.access);
  ApiService.mountInterceptor();
};

export default {

  async login(form) {
    try {
      const apiRes = await ApiService.post('/login', form);
      if (apiRes) {
        if (apiRes.data.status == 0) {
          saveSessionInfo(apiRes.data.data);
        } else {
          Utility.showErrorMessage('Login', 'api', apiRes.data);
        }
        return apiRes.data.status == 0;
      }
    } catch (error) {
      Utility.showErrorMessage('Login', 'network', error.message);
      return false;
    }
  },

  async register(form) {
    try {
      const apiRes = await ApiService.post('/register-request', form);
      if (apiRes.data.status == 0) {
        router.push('/login?m=plfw');
        return true;
      } else {
        Utility.showErrorMessage('Register', 'api', apiRes.data);
      }
    } catch (error) {
      Utility.showErrorMessage('Register', 'network', error);
    }
    return false;
  },

  async forgotPassword(email) {
    try {
      const apiRes = await ApiService.post('/forgot-password', { email });
      if (apiRes.data.status != 0) {
        Utility.showErrorMessage('Forgot password', 'api', apiRes.data);
      }
      return apiRes.data.status == 0;
    } catch (error) {
      Utility.showErrorMessage('Forgot password', 'network', error.message);
      return false;
    }
  },

  async resetPassword(formData) {
    try {
      const apiRes = await ApiService.post('/reset-password', formData);
      if (apiRes.data.status != 0) {
        Utility.showErrorMessage('Reset password', 'api', apiRes.data);
      }
      return apiRes.data.status == 0;
    } catch (error) {
      Utility.showErrorMessage('Reset password', 'network', error.message);
      return false;
    }
  },

  async acceptInvitation(formData) {
    try {
      const apiRes = await ApiService.post('/invitation/accept-new', formData);
      if (apiRes.data.status != 0) {
        Utility.showErrorMessage('Accept invitation', 'api', apiRes.data);
      }
      return apiRes.data.status == 0;
    } catch (error) {
      Utility.showErrorMessage('Accept invitation', 'network', error.message);
      return false;
    }
  },

  async refreshToken() {
    const apiRes = await ApiService.post('/refresh-token', SessionService.getRefreshToken());
    if (apiRes && apiRes.data.status == 0) {
      saveSessionInfo(apiRes.data.data);
      return apiRes.data.data.tokens.ACCESS;
    }
    return null;
  },

  logout(expired) {
    ApiService.post('/logout')
      .then(() => {
        SessionService.removeSessionInfo();
        ApiService.removeHeader();
        ApiService.unmountInterceptor();
        if (expired == false) Utility.showShortInfoMessage('Logout', 'You have been successfully logged out!');
        router.push('/login' + (expired == true ? '?m=1nqq' : ''));
    });
  }

};
