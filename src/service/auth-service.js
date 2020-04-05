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

  async requestRegistration(form) {
    try {
      const apiRes = await ApiService.post('/request-registration', form);
      if (apiRes && apiRes.data.status == 0) {
        router.push('/complete-registration');
        return true;
      } else {
        Utility.showErrorMessage('Registration Request', 'api', apiRes.data);
      }
    } catch (error) {
      Utility.showErrorMessage('Registration Request', 'network', error);
    }
    return false;
  },

  async completeRegistration(activationCode) {
    try {
      const apiRes = await ApiService.post('/complete-registration?token=' + activationCode);
      if (apiRes && apiRes.data.status == 0) {
        saveSessionInfo(apiRes.data.data);
        return true;
      } else {
        Utility.showErrorMessage('Registration Complete', 'api', apiRes.data);
      }
    } catch (error) {
      Utility.showErrorMessage('Registration Complete', 'network', error);
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
      return true;
    }
    return false;
  },
  
  logout(expired) {
    ApiService.post('/logout', { email: SessionService.getUserEmail() })
      .then(() => {
        SessionService.removeSessionInfo();
        ApiService.removeHeader();
        ApiService.unmountInterceptor();
        if (expired == false) Utility.showShortInfoMessage('Logout', 'You have been successfully logged out!');
        router.push('/login' + (expired == true ? '?m=1nqq' : ''));
    });
  }

};
