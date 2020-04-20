import ApiService from '../service/api';
import Helper from '../service/helper';
import { make } from 'vuex-pathify';

import router from '../router';
import Consts from '../helpers/consts';
import Utility from '../helpers/utility';

const state = {
  session: null,
  sessions: null,
};

const actions = {

  async login({ commit }, form) {
    const res = await Helper.call('Login', { url: '/login', data: form });
    if (res.status == true) {
      commit('SET_SESSIONS', res.data.sessions, res.data.sessionNo);
      return res.data.sessionNo;
    }
    return null;
  },

  logout({ commit }, expired) {
    if (expired == false) {
      ApiService.post('/logout')
        .then(() => {
          Utility.showShortInfoMessage('Logout', 'You have been successfully logged out!');
      });
    }
    commit('REMOVE_SESSION');
    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  }

};

const mutations = {
  ...make.mutations(state),

  SET_SESSIONS(state, sessions, sessionNo) {
    state.sessions = sessions;
    state.session = sessions[sessionNo];
    localStorage.setItem(Consts.keys.SESSIONS, JSON.stringify(sessions));
  },

  REMOVE_SESSION() {
    state.session = null;
    state.sessions = null;
    localStorage.removeItem(Consts.keys.SESSIONS);
  }

};

const getters = make.getters(state);

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
