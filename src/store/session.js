import ApiService from '../service/api';
import Helper from '../service/helper';
import moment from 'moment-timezone';
import router from '../router';

import { BroadcastChannel } from 'broadcast-channel';

const state = {
  no: 0,
  list: [],
  current: { }
};

const actions = {

  async login({ dispatch }, form) {
    const res = await Helper.call('Login', { url: '/login', data: form });
    if (res.status == true) {
      dispatch('create', res);
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
    localStorage.clear();
    logoutChannel.postMessage();
    commit('RESET');
    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  },

  create({ state, commit }, res) {
    state.no = res.data.sessionNo;
    commit('SET_LIST', res.data);
    loginChannel.postMessage(res.data);
  },

  refresh({ commit }) {
    ApiService.get('/app/refresh-session')
      .then((res) => {
        if (res && res.data) {
          commit('SET_CURRENT', res.data.data.session);
        }
      });
  }

};

function buildCurrent(state) {
  console.log("HAAAAASSSAAAAAAB");
  let stat = { };
  const selected = state.list[state.no];
  if (selected) {
    stat = {
      isActive : false,
      isSubscriber: false,
      isFree : false,
      hasTime : false,
      daysToRenewal : 0,
      account: selected.account,
      status: selected.accountStatus,
      planId: selected.planId,
      planName: selected.planName,
      renewalAt: selected.renewalAt,
      linkLimit: selected.linkLimit,
      linkCount: selected.linkCount,
      remainingLinkCount: (selected.linkLimit-selected.linkCount),
      lastStatusUpdate: selected.lastStatusUpdate,
      email: selected.email,
      user: selected.user,
      role: selected.role,
      timezone: selected.timezone,
      currencyFormat: selected.currencyFormat,
      everSubscribed: selected.everSubscribed,
    };
    if (selected.renewalAt) {
      const renewal = moment(selected.renewalAt, 'YYYY-MM-DD').tz(selected.timezone);
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
        stat.lastStatusUpdate = stat.renewalAt;
      }
    }
    state.current = stat;
  }
}

const mutations = {

  SET_CURRENT(state, ses, sid) {
    if (sid != undefined && sid >= 0) state.no = sid;
    if (state.no == undefined || state.no < 0 || state.no >= state.list.length) state.no = 0;
    state.list[state.no] = ses;
    loginChannel.postMessage(state.list);
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

  SET_LINK_COUNT(state, count) {
    if (state.list[state.no]) {
      state.list[state.no].linkCount = count;
      state.list[state.no].remainingLinkCount = (state.list[state.no].linkLimit-count);
      state.current.linkCount = count;
      state.current.remainingLinkCount = (state.current.linkLimit-count);
    }
  },

  CHANGE_LINK_COUNT(state, val) {
    if (state.list[state.no]) {
      state.list[state.no].linkCount += val;
      state.list[state.no].remainingLinkCount = (state.list[state.no].linkLimit-state.list[state.no].linkCount);
      state.current.linkCount += val;
      state.current.remainingLinkCount = (state.current.linkLimit-state.current.linkCount);
    }
  },

  RESET(state) {
    state.no = 0;
    state.list = [];
  },

}

const ACTIVE_ACCOUNT_STATUSES = [
  'FREE',
  'COUPONED',
  'SUBSCRIBED'
];

const getters = {

  getSessionList: (state) => {
    if (state) return state.list;
  },

  //TODO: some fields like linkCount, isFree... must be refreshed somehow after state changed by user!
  getCurrentStatus: (state) => {
    return state.current;
  },

  isAdmin: (state) => {
    return (state.list[state.no] && state.list[state.no].role === 'ADMIN');
  },

  isNotAdmin: (state) => {
    return (state.list[state.no] && state.list[state.no].role !== 'ADMIN');
  },

  isEditor: (state) => {
    return (state.list[state.no] && state.list[state.no].role === 'EDITOR') || getters.isAdmin(state);
  },

  isViewer: (state) => {
    return (state.list[state.no] && state.list[state.no].role === 'VIEWER');
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
