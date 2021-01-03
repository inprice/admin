import ApiService from '../service/api';
import Helper from '../service/helper';
import moment from 'moment-timezone';
import router from '../router';
import SystemConsts from '@/data/system';

import { BroadcastChannel } from 'broadcast-channel';

const state = {
  no: 0,
  current: {},
  list: []
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
    localStorage.removeItem(SystemConsts.KEYS.SESSIONS);
    logoutChannel.postMessage();
    commit('RESET');
    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  },

  create({ state, commit }, res) {
    localStorage.setItem(SystemConsts.KEYS.SESSIONS, JSON.stringify(res.data.sessions));
    state.no = res.data.sessionNo;
    state.current = state.list[state.no];
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

const mutations = {

  SET_CURRENT(state, ses) {
    state.current = ses;
    state.list[state.no] = state.current;
    localStorage.setItem(SystemConsts.KEYS.SESSIONS, JSON.stringify(state.list));
    loginChannel.postMessage(state.list);
  },

  SET_LIST(state, data) {
    //persisting list into localstorage is already done by caller function!
    if (data.sessions) {
      state.list = data.sessions;
    }
    if (data.no !== undefined && data.no > -1 && data.no <= state.list.length) {
      state.no = data.no;
      state.current = state.list[state.no];
    }
  },

  RESET(state) {
    state.no = 0;
    state.current = {};
    state.list = [];
  },

}

const ACTIVE_ACCOUNT_STATUSES = [
  'FREE',
  'COUPONED',
  'SUBSCRIBED'
];

const getters = {

  getCurrent: (state) => {
    return state.current;
  },

  getSessionList: (state) => {
    return state.list;
  },

  getCurrentStatus: (state) => {
    if (state.current) {
      const stat = {
        isActive : false,
        isSubscriber: false,
        isFree : false,
        hasTime : false,
        daysToRenewal : 0,
        account: state.current.account,
        status: state.current.accountStatus,
        planId: state.current.planId,
        planName: state.current.planName,
        renewalAt: state.current.renewalAt,
        hasProduct: state.current.productCount>0,
        lastStatusUpdate: state.current.lastStatusUpdate,
        email: state.current.email,
        user: state.current.user,
        role: state.current.role,
        timezone: state.current.timezone,
        currencyFormat: state.current.currencyFormat,
        everSubscribed: state.current.everSubscribed,
      };
      if (state.current.renewalAt) {
        const renewal = moment(state.current.renewalAt, 'YYYY-MM-DD').tz(state.current.timezone);
        const dayDiff = renewal.diff(moment().startOf('day'), 'days');
        const base = (state.current.accountStatus == 'SUBSCRIBED' ? -3 : 0); //subscribers can use the system for extra three days!!!
        const value = (dayDiff >= base && ACTIVE_ACCOUNT_STATUSES.includes(state.current.accountStatus));
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
    return { };
  },

  isAdmin: (state) => {
    return state.current.role === 'ADMIN';
  },

  isNotAdmin: (state) => {
    return state.current.role !== 'ADMIN';
  },

  isEditor: (state) => {
    return state.current.role === 'EDITOR' || getters.isAdmin(state);
  },

  isViewer: (state) => {
    return state.current.role === 'VIEWER';
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
