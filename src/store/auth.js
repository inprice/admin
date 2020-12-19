import ApiService from '../service/api';
import Helper from '../service/helper';
import { make } from 'vuex-pathify';
import moment from 'moment-timezone';
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

  REFRESH_SESSION(state, ses) {
    state.session = ses;
    state.sessions[state.sessionNo] = ses;
    localStorage.setItem(SystemConsts.keys.SESSIONS, JSON.stringify(state.sessions));
    loginChannel.postMessage(state.sessions);
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
/*

  setSessions(state, sessions) {
    state.sessionNo = 0;
    state.sessions = sessions;
    state.session = sessions[0];
  },

  SET_USER_INFO(state, data) {
    state.session.user = data.name;
    state.session.timezone = data.timezone;
    state.sessions[state.sessionNo] = state.session;
    localStorage.setItem(SystemConsts.keys.SESSIONS, JSON.stringify(state.sessions));
  },

  SET_ACCOUNT_INFO(state, data) {
    state.session.account = data.name;
    state.session.currencyFormat = data.currencyFormat;
    state.sessions[state.sessionNo] = state.session;
    localStorage.setItem(SystemConsts.keys.SESSIONS, JSON.stringify(state.sessions));
  },
*/
}

const ACTIVE_ACCOUNT_STATUSES = [
  'FREE',
  'COUPONED',
  'SUBSCRIBED'
];

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

  CURRENT_STATUS: (state) => {
    if (state.session) {
      const stat = {
        isActive : false,
        isSubscriber: false,
        isFree : false,
        hasTime : false,
        daysToRenewal : 0,
        account: state.session.account,
        status: state.session.accountStatus,
        planId: state.session.planId,
        planName: state.session.planName,
        renewalAt: state.session.renewalAt,
        hasProduct: state.session.productCount>0,
        lastStatusUpdate: state.session.lastStatusUpdate,
        email: state.session.email,
        user: state.session.user,
        timezone: state.session.timezone,
        currencyFormat: state.session.currencyFormat,
        everSubscribed: state.session.everSubscribed,
      };
      if (state.session.renewalAt) {
        const renewal = moment(state.session.renewalAt, 'YYYY-MM-DD').tz(state.session.timezone);
        const dayDiff = renewal.diff(moment().startOf('day'), 'days');
        const base = (state.session.accountStatus == 'SUBSCRIBED' ? -3 : 0); //subscribers can use the system for extra three days!!!
        const value = (dayDiff >= base && ACTIVE_ACCOUNT_STATUSES.includes(state.session.accountStatus));
        stat.isActive = value;
        stat.isSubscriber = (value && base < 0);
        stat.isFree = (value && stat.isSubscriber == false);
        stat.hasTime = value;
        stat.daysToRenewal = dayDiff;
        if (value == false && (stat.status != 'STOPPED' || stat.status != 'CANCELLED')) {
          stat.status = 'STOPPED';
          stat.lastStatusUpdate = stat.renewalAt;
        }
      }
      return stat;
    }
    return null;
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
