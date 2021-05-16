import ApiService from '../service/api';
import Helper from '../service/helper';
import moment from 'moment-timezone';
import router from '../router';

import { BroadcastChannel } from 'broadcast-channel';

const state = {
  no: null,
  list: [],
  current: {},
};

const actions = {

  async login({ dispatch }, form) {
    const res = await Helper.call('Login', { url: '/login', data: form }, true);
    if (res.status == true) {
      dispatch('create', res);
    }
    return res;
  },

  logout({ state, commit }, expired) {
    if (expired == false) {
      ApiService.post('/logout')
        .then(() => {
          commit('snackbar/setMessage', { text: 'You have been successfully logged out!' }, { root: true });
        });
    }
    localStorage.clear();
    if (state.current.role != 'SUPER') logoutChannel.postMessage();
    commit('RESET');
    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  },

  create({ state, commit }, res) {
    state.no = res.data.sessionNo;
    commit('SET_LIST', res.data);
    if (!res.data.isPriviledge) loginChannel.postMessage(res.data);
  },

  refresh({ commit }) {
    ApiService.get('/app/refresh-session')
      .then((res) => {
        if (res && res.data) {
          commit('SET_CURRENT', res.data.data.session);
        }
      });
  },

  unbindAccount({ commit }) {
    ApiService.post('/sys/account/unbind')
      .then((res) => {
        if (res && res.data) {
          commit('SET_CURRENT', res.data.data);
        }
      });
  }

};

function buildCurrent(state) {
  let stat = { };
  const selected = state.list[state.no];
  if (selected) {
    stat = {
      accountId : selected.accountId,
      isActive : false,
      isSubscriber: false,
      isFree : false,
      hasTime : false,
      daysToRenewal : 0,
      account: selected.account,
      status: selected.accountStatus,
      planId: selected.planId,
      planName: selected.planName,
      subsRenewalAt: selected.subsRenewalAt,
      linkCount: selected.linkCount,
      lastStatusUpdate: selected.lastStatusUpdate,
      email: selected.email,
      user: selected.user,
      role: selected.role,
      timezone: selected.timezone,
      currencyFormat: selected.currencyFormat,
      everSubscribed: (selected.subsStartedAt != undefined),
    };
    if (selected.subsRenewalAt) {
      const renewal = moment(selected.subsRenewalAt, 'YYYY-MM-DD').tz(selected.timezone);
      const dayDiff = renewal.diff(moment().startOf('day'), 'days');
      const base = (selected.accountStatus == 'SUBSCRIBED' ? -3 : 0); //subscribers can use the system for extra three days!!!
      const value = (dayDiff >= base && ACTIVE_ACCOUNT_STATUSES.includes(selected.accountStatus));
      stat.isActive = value;
      stat.isSubscriber = (value && base < 0);
      stat.isFree = (value && stat.isSubscriber == false);
      stat.hasTime = value;
      stat.daysToRenewal = dayDiff;
      if (value == false && (stat.status != 'STOPPED' || stat.status != 'CANCELLED')) {
        stat.status = 'STOPPED';
        stat.lastStatusUpdate = stat.subsRenewalAt;
      }
    }
    state.current = stat;
  }
}

const mutations = {

  SET_CURRENT(state, ses, sid) {
    if (sid != undefined && sid >= 0 && sid < state.list.length) {
      state.no = sid;
    } else {
      state.no = 0;
    }
    if (state.no == undefined || state.no < 0 || state.no >= state.list.length) state.no = 0;
    state.list[state.no] = ses;
    if (state.current.role != 'SUPER') loginChannel.postMessage(state.list);
    buildCurrent(state);
  },

  SET_LIST(state, data) {
    if (data.sessions) {
      state.list = data.sessions;
    }
    if (data.no !== undefined && data.no > -1 && data.no <= state.list.length) {
      state.no = data.no;
    }
    buildCurrent(state);
  },

  SET_LINK_COUNT(state, val) {
    if (state.list[state.no]) {
      state.list[state.no].linkCount = val;
      state.current.linkCount = val;
    }
  },

  RESET(state) {
    state.no = null;
    state.list = [];
  },

  SET_ACCOUNT_INFO(state, form) {
    if (form && state.current && state.list[state.no]) {
      state.current.account = form.name;
      state.current.currencyFormat = form.currencyFormat;
      state.list[state.no].account = form.name;
      state.list[state.no].currencyFormat = form.currencyFormat;
    }
  },

}

const ACTIVE_ACCOUNT_STATUSES = [
  'FREE',
  'COUPONED',
  'SUBSCRIBED'
];

const getters = {

  hasASession: (state) => {
    if (state) return state.current.status != 'UNKNOWN';
    return false;
  },

  getSessionList: (state) => {
    if (state) return state.list;
  },

  getCurrentStatus: (state) => {
    return state.current;
  },

  isSuperUser: (state) => {
    return (state.current.role == 'SUPER');
  },

  isNotSuperUser: (state) => {
    return state.current.role != 'SUPER';
  },

  isAdmin: (state) => {
    return (state.current && (state.current.role === 'ADMIN'));
  },

  isNotAdmin: (state) => {
    return (state.current && (state.current.role !== 'ADMIN'));
  },

  isEditor: (state) => {
    return (state.current && (state.current.role === 'ADMIN' || state.current.role === 'EDITOR'));
  },

  isNotEditor: (state) => {
    return (state.current && !(state.current.role === 'ADMIN' || state.current.role === 'EDITOR'));
  },

  isViewer: (state) => {
    return (state.current && state.current.role === 'VIEWER');
  },

};

const loginChannel = new BroadcastChannel('login');
loginChannel.onmessage = (e) => {
  mutations.SET_LIST(state, e);
};

const logoutChannel = new BroadcastChannel('logout');
logoutChannel.onmessage = () => {
  mutations.RESET(state);
  router.push('/login');
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
