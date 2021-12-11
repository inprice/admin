import ApiService from '../service/api';
import Helper from '../service/helper';
import moment from 'moment-timezone';
import router from '../router';

import { BroadcastChannel } from 'broadcast-channel';

const state = {
  no: null,
  list: [],
  current: {}
};

const actions = {

  async login({ dispatch }, form) {
    const res = await Helper.call('Login', { url: '/login', data: form });
    if (res.status < 400 && res.data) {
      dispatch('create', res);
    }
    return res;
  },

  logout({ state, commit }, expired) {
    if (state.current.role != 'SUPER') logoutChannel.postMessage();
    if (expired == false) {
      ApiService.post('/logout')
        .then(() => {
          commit('snackbar/setMessage', { text: 'You have been successfully logged out!' }, { root: true });
        });
    }
    localStorage.clear();
    commit('RESET');
    router.push('/login' + (expired == true ? '?m=1nqq' : ''));
  },

  create({ commit }, res) {
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

  unbindWorkspace({ commit }) {
    ApiService.post('/sys/workspace/unbind')
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
      isActive : false,
      isSubscriber: false,
      isFree : false,
      hasTime : false,
      daysToRenewal : 0,
      workspace: selected.workspace,
      status: selected.workspaceStatus,
      planId: selected.planId,
      planName: selected.planName,
      subsRenewalAt: selected.subsRenewalAt,
      linkCount: selected.linkCount,
      lastStatusUpdate: selected.lastStatusUpdate,
      email: selected.email,
      fullName: selected.fullName,
      role: selected.role,
      timezone: selected.timezone,
      currencyCode: selected.currencyCode,
      currencyFormat: selected.currencyFormat,
      everSubscribed: (selected.subsStartedAt != undefined),
    };
    if (selected.subsRenewalAt) {
      const renewal = moment(selected.subsRenewalAt, 'YYYY-MM-DD').tz(selected.timezone);
      const dayDiff = renewal.diff(moment().startOf('day'), 'days');
      const base = (selected.workspaceStatus == 'SUBSCRIBED' ? -3 : 0); //subscribers can use the system for extra three days!!!
      const value = (dayDiff >= base && ACTIVE_WORKSPACE_STATUSES.includes(selected.workspaceStatus));
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
    if (selected.workspaceId) stat.workspaceId = selected.workspaceId; //super user is binding
    state.current = stat;
  }
}

const mutations = {

  SET_CURRENT(state, ses) {
    state.no = router.currentRoute.params.sid;
    if (state.no == undefined || state.no < 0 || state.no >= state.list.length) state.no = 0;
    state.list[state.no] = ses;
    if (state.current.role != 'SUPER') loginChannel.postMessage(state.list);
    buildCurrent(state);
  },

  CHANGE_CURRENT(state, sid) {
    if (sid != undefined && sid >= 0 && sid < state.list.length) {
      state.no = sid;
    } else {
      state.no = 0;
    }
    if (state.no == undefined || state.no < 0 || state.no >= state.list.length) state.no = 0;
    buildCurrent(state);
  },

  SET_LIST(state, data) {
    if (data.sessions) {
      state.list = data.sessions;
    }
    if (data.sessionNo !== undefined && data.sessionNo > -1 && data.sessionNo <= state.list.length) {
      state.no = data.sessionNo;
    }
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

  SET_WORKSPACE_INFO(state, form) {
    if (form && state.current && state.list[state.no]) {
      state.current.workspace = form.name;
      state.current.currencyFormat = form.currencyFormat;
      state.list[state.no].workspace = form.name;
      state.list[state.no].currencyFormat = form.currencyFormat;
    }
  },

  SET_USER_INFO(state, form) {
    if (form && state.current && state.list[state.no]) {
      state.current.fullName = form.fullName;
      state.current.timezone = form.timezone;
      state.list[state.no].fullName = form.fullName;
      state.list[state.no].timezone = form.timezone;
    }
  },

}

const ACTIVE_WORKSPACE_STATUSES = [
  'FREE',
  'VOUCHERED',
  'SUBSCRIBED'
];

const demoEmail = 'demo@inprice.io';

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

  getWorkspaceInfo: (state) => {
    if (state.current) {
      return {
        name: state.current.workspace,
        currency: state.current.currencyCode,
        currencyFormat: state.current.currencyFormat,
      }
    }
  },

  isSuperUser: (state) => {
    return (state.current.role == 'SUPER');
  },

  isNotSuperUser: (state) => {
    return state.current.role != 'SUPER';
  },

  isAdmin: (state) => {
    return (state.current && (state.current.role === 'ADMIN' || state.current.email === demoEmail));
  },

  isNotAdmin: (state) => {
    return (state.current && (state.current.role !== 'ADMIN' && state.current.email !== demoEmail));
  },

  isNotEditor: (state) => {
    return (state.current && (state.current.email !== demoEmail && !(state.current.role === 'ADMIN' || state.current.role === 'EDITOR')));
  },

  isDemoUser: (state) => {
    return (state.current && state.current.email === demoEmail);
  }

};

import store from '../store/'

const loginChannel = new BroadcastChannel('login');
loginChannel.onmessage = (e) => {
  store.commit('session/SET_LIST', e);
};

const logoutChannel = new BroadcastChannel('logout');
logoutChannel.onmessage = () => {
  store.commit('session/RESET');
  router.push({ name: 'login' }).catch(() => {});
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
