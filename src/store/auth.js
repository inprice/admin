import ApiService from '../service/api';
import Helper from '../service/helper';
import { make } from 'vuex-pathify';

import router from '../router';
import SystemConsts from '@/data/system';

import { BroadcastChannel } from 'broadcast-channel';

const state = {
  sessionNo: 0,
  session: {},
  sessions: []
};

const actions = {

  async login({ dispatch }, form) {
    const res = await Helper.call('Login', { url: '/login', data: form });
    if (res.status == true) {
      dispatch('createSession', res);
    }
    return res.data && res.data;
  },

  logout({ commit }, expired) {
    if (expired == false) {
      ApiService.post('/logout')
        .then(() => {
          commit('snackbar/setMessage', { text: 'You have been successfully logged out!' }, { root: true });
      });
    }
    localStorage.removeItem(SystemConsts.keys.SESSIONS);
    logoutChannel.postMessage();
    commit('CLEAR_SESSION');
    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  },

  createSession({ state, commit }, res) {
    localStorage.setItem(SystemConsts.keys.SESSIONS, JSON.stringify(res.data.sessions));
    state.sessionNo = res.data.sessionNo;
    commit('REFRESH_SESSIONS', res.data);
    loginChannel.postMessage(res.data);
  },

  refreshSession({ commit }) {
    ApiService.get('/app/refresh-session')
      .then((res) => {
        if (res && res.data) {
          commit('REFRESH_SESSION', res.data.data.session);
        }
      });
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
    state.session = data;
    state.sessions[state.sessionNo] = data;
  },

  REFRESH_SESSIONS(state, data) {
    state.sessions = data.sessions;
    state.session = data.sessions[state.sessionNo];
  },

  CLEAR_SESSION(state) {
    state.sessionNo = 0;
    state.session = {};
    state.sessions = [];
  },

  SET_USER_INFO(state, data) {
    state.session.user = data.name;
    state.session.timezone = data.timezone;
    state.sessions[state.sessionNo] = state.session;
    localStorage.setItem(SystemConsts.keys.SESSIONS, JSON.stringify(state.sessions));
  },

  SET_COMPANY_INFO(state, data) {
    state.session.company = data.name;
    state.session.currencyFormat = data.currencyFormat;
    state.sessions[state.sessionNo] = state.session;
    localStorage.setItem(SystemConsts.keys.SESSIONS, JSON.stringify(state.sessions));
  },

}

const getters = {
  ...make.getters(state),

  IS_ADMIN: (state) => {
    return state.session.role === 'ADMIN';
  },

  IS_EDITOR: (state) => {
    return state.session.role === 'EDITOR' || getters.IS_ADMIN(state);
  },

  IS_VIEWER: (state) => {
    return state.session.role === 'VIEWER' || getters.IS_EDITOR(state);
  },

  IS_JUST_VIEWER: (state) => {
    return state.session.role === 'VIEWER';
  },

};

const loginChannel = new BroadcastChannel('login');
loginChannel.onmessage = (e) => {
  mutations.REFRESH_SESSIONS(state, e);
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
