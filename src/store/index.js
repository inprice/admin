import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify'

import system from './system';
import auth from './auth';
import snackbar from './snackbar';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    system,
    auth,
    snackbar
  },

  plugins: [
    pathify.plugin
  ],

  strict: process.env.DEV
});
