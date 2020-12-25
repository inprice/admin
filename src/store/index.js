import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify'

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
    pathify.plugin
  ],

  strict: process.env.DEV
});
