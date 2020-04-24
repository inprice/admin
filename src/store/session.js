import ApiService from '../service/api';
import Helper from '../service/helper';
import { make } from 'vuex-pathify';

import router from '../router';
import Consts from '../helpers/consts';
import Utility from '../helpers/utility';

import { BroadcastChannel } from 'broadcast-channel';

const state = {
  sessionNo: 0,
  session: null,
  sessions: null,
};

const actions = {

  async login({ state, commit }, form) {
    const res = await Helper.call('Login', { url: '/login', data: form });
    if (res.status == true) {
      localStorage.setItem(Consts.keys.SESSIONS, JSON.stringify(res.data.sessions));
      state.sessionNo = res.data.sessionNo;
      commit('REFRESH_SESSION', res.data);
      loginChannel.postMessage(res.data);
      return res.data.sessionNo;
    }
    return null;
  },

  async logout({ commit }, expired) {
    await ApiService.post('/logout');
    Utility.showShortInfoMessage('Logout', 'You have been successfully logged out!');

    localStorage.removeItem(Consts.keys.SESSIONS);
    logoutChannel.postMessage();
    commit('CLEAR_SESSION');

    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  }

};

const mutations = {
  ...make.mutations(state),

  setSessions(state, sessions) {
    state.sessionNo = 0;
    state.sessions = sessions;
    state.session = sessions[0];
  },

  REFRESH_SESSION(state, data) {
    state.sessions = data.sessions;
    state.session = data.sessions[state.sessionNo];
  },

  CLEAR_SESSION(state) {
    state.sessionNo = 0;
    state.session = null;
    state.sessions = null;
  }

}

const getters = make.getters(state);

const loginChannel = new BroadcastChannel('login');
loginChannel.onmessage = (e) => {
  mutations.REFRESH_SESSION(state, e);
};

const logoutChannel = new BroadcastChannel('logout');
logoutChannel.onmessage = () => {
  mutations.CLEAR_SESSION(state);
  router.push('/login');
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
