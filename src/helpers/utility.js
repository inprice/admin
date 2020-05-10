import Vue from 'vue';
// import AuthService from '../service/auth';

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

    if (message.includes('code 401')) return;

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
  },
  verifyURL(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
  },
  removeTabIndexFromIconButtons(el) {
    let list, index;
    list = el.getElementsByClassName("notranslate");
    for (index = 0; index < list.length; ++index) {
        list[index].setAttribute('tabindex', -1);
    }
  }
};
