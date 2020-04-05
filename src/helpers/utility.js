import Vue from 'vue';
// import AuthService from '../service/auth-service';

export default {
  showInfoMessage(caller, message) {
    Vue.notify({
      type: 'info',
      group: 'info',
      title: caller.toUpperCase(),
      text: message,
      ignoreDuplicates: true
    });
  },
  showShortInfoMessage(caller, message) {
    Vue.notify({
      type: 'success',
      group: 'short-info',
      title: caller.toUpperCase(),
      text: message,
      ignoreDuplicates: true
    });
  },
  showErrorMessage(caller, msgType, msg) {
    if (msg === undefined) return;

    let message = '';
    if (msg.reason) {
      message = msg.reason;
    } else if (msg.data) {
      message = msg.data.reason;
    } else if (msg.stack && msg.message) {
      message = msg.message;
    }

    if (message.includes('code 401')) {
      // AuthService.logout(true);
      return;
    }

    Vue.notify({
      type: 'error',
      group: 'error',
      title: caller.toUpperCase(),
      text: message,
      ignoreDuplicates: true
    });
  },
  doubleRaf(callback) {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  },
  verifyEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());
  }
};
