import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import pathify from 'vuex-pathify'

import SystemConsts from '@/data/system';

import system from './system';
import session from './session';
import snackbar from './snackbar';
import warning from './warning';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    system,
    session,
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
