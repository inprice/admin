import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify'
import createPersistedState from 'vuex-persistedstate'

import SystemConsts from '@/data/system';

import session from './session';
import message from './message';
import snackbar from './snackbar';
import warning from './warning';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    session,
    message,
    snackbar,
    warning
  },

  plugins: [
    pathify.plugin,
    createPersistedState({
      key: SystemConsts.KEYS.SESSIONS,
      paths: ['session']
    })
  ],

  strict: process.env.DEV
});
