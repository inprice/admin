import ApiService from '../service/api';
import Helper from '../service/helper';
import Consts from '../helpers/consts';

import router from '../router';
import Utility from '../helpers/utility';

const state = {
  sessionNo: 0,
  sessions: JSON.parse(localStorage.getItem(Consts.keys.SESSIONS) || '[]'),
};

const actions = {

  async login({ commit }, form) {
    const res = await Helper.call('Login', { url: '/login', data: form });
    if (res.status == true) {
      commit('SET_SESSIONS', res.data.sessions);
      commit('SWITCH_SESSION', res.data.sessionNo);
      return res.data.sessionNo;
    }
    return null;
  },

  logout({ commit }, expired) {
    if (!expired || expired == false) {
      ApiService.post('/logout')
        .then(() => {
          Utility.showShortInfoMessage('Logout', 'You have been successfully logged out!');
      });
    }
    commit('REMOVE_SESSIONS');
    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  },

  switchSession({ commit }, sessionNo) {
    commit('SWITCH_SESSION', sessionNo);
  }

};

const mutations = {

  SET_SESSIONS(state, sessions) {
    state.sessions = sessions || [];
    localStorage.setItem(Consts.keys.SESSIONS, JSON.stringify(sessions));
  },

  REFRESH_SESSIONS(state) {
    const sessions = JSON.parse(localStorage.getItem(Consts.keys.SESSIONS) || '[]');
    if (sessions) {
      state.sessions = sessions;
    }
  },

  REMOVE_SESSIONS(state) {
    localStorage.removeItem(Consts.keys.SESSIONS);
    state.sessionNo = 0
    state.sessions = [];
  },

  SWITCH_SESSION(state, sessionNo) {
    if (state.sessions && sessionNo && sessionNo < state.sessions.length) {
      state.sessionNo = sessionNo;
    } else {
      state.sessionNo = 0;
    }
  }

};

const getters = {

  getSessionNo(state) {
    return state.sessionNo;
  },

  getSession(state) {
    if (state.sessions && state.sessions.length > state.sessionNo) {
      return state.sessions[state.sessionNo];
    }
    return null;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
